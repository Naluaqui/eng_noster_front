'use client';

import { useCallback, useEffect, useState } from 'react';
import { getCompanySettingsById } from '@/features/settings/repositories/settings.repository';
import {
  getSelectedCompanyId,
  selectedCompanyChangedEvent,
} from '@/features/settings/repositories/workspace.repository';
import {
  createMeeting as createMeetingRepository,
  deleteMeeting as deleteMeetingRepository,
  getMeetings,
  updateMeeting as updateMeetingRepository,
  updateMeetingStatus as updateMeetingStatusRepository,
} from '../repositories/meetings.repository';
import { getStoredMeetingAnalyses, storedMeetingAnalysesChangedEvent } from '../repositories/meeting-analyses.repository';
import type {
  CreateMeetingInput,
  Meeting,
  MeetingCatalog,
  MeetingStatus,
  UpdateMeetingInput,
} from '../types/meeting';

const emptyCatalog: MeetingCatalog = {
  products: [],
  people: [],
};

function toUniqueOptions(values: string[]) {
  const options = new Map<string, string>();

  values.forEach((value) => {
    const label = value.trim();
    const key = label.toLowerCase();

    if (label && !options.has(key)) {
      options.set(key, label);
    }
  });

  return Array.from(options, ([value, label]) => ({
    label,
    value,
  })).sort((first, second) => first.label.localeCompare(second.label, 'pt-BR'));
}

function enrichMeetingsWithAnalyses(meetings: Meeting[], companyId: string | null): Meeting[] {
  if (!companyId) {
    return meetings;
  }

  const analyses = getStoredMeetingAnalyses(companyId);

  return meetings.map((meeting) => {
    const analysis = analyses[meeting.id];

    if (!analysis) {
      return meeting;
    }

    return {
      ...meeting,
      analysis,
      description: meeting.description?.trim() || analysis.resumo_executivo,
      status: 'analyzed' as const,
    };
  });
}

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [catalog, setCatalog] = useState<MeetingCatalog>(emptyCatalog);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [movingMeetingId, setMovingMeetingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadMeetings = useCallback(async () => {
    const companyId = getSelectedCompanyId();

    try {
      setIsLoading(true);
      setError(null);
      setSelectedCompanyId(companyId);

      if (!companyId) {
        setMeetings([]);
        setCatalog(emptyCatalog);
        return;
      }

      const [data, settings] = await Promise.all([getMeetings(), getCompanySettingsById(companyId)]);
      const people = settings.teams.flatMap((team) => [
        ...team.people.map((person) => person.email),
        ...team.groups.flatMap((group) => group.people.map((person) => person.email)),
      ]);

      setMeetings(enrichMeetingsWithAnalyses(data, companyId));
      setCatalog({
        products: toUniqueOptions(settings.products.map((product) => product.name)),
        people: toUniqueOptions(people),
      });
    } catch {
      setError('Nao foi possivel carregar as reunioes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadMeetings);
  }, [loadMeetings]);

  useEffect(() => {
    window.addEventListener(selectedCompanyChangedEvent, loadMeetings);
    window.addEventListener(storedMeetingAnalysesChangedEvent, loadMeetings);

    return () => {
      window.removeEventListener(selectedCompanyChangedEvent, loadMeetings);
      window.removeEventListener(storedMeetingAnalysesChangedEvent, loadMeetings);
    };
  }, [loadMeetings]);

  const moveMeeting = useCallback(
    async (meetingId: string, status: MeetingStatus) => {
      const currentMeeting = meetings.find((meeting) => meeting.id === meetingId);

      if (!currentMeeting || currentMeeting.status === status || status === 'analyzed' || currentMeeting.status === 'analyzed') {
        return;
      }

      const previousMeetings = meetings;

      setMovingMeetingId(meetingId);
      setError(null);
      setMeetings((currentMeetings) =>
        currentMeetings.map((meeting) =>
          meeting.id === meetingId ? { ...meeting, status } : meeting,
        ),
      );

      try {
        const updatedMeeting = await updateMeetingStatusRepository(meetingId, status);

        setMeetings((currentMeetings) =>
          currentMeetings.map((meeting) =>
            meeting.id === updatedMeeting.id
              ? enrichMeetingsWithAnalyses([updatedMeeting], selectedCompanyId)[0]
              : meeting,
          ),
        );
      } catch {
        setMeetings(previousMeetings);
        setError('Nao foi possivel mover a reuniao.');
      } finally {
        setMovingMeetingId(null);
      }
    },
    [meetings, selectedCompanyId],
  );

  const createMeeting = useCallback(async (input: CreateMeetingInput) => {
    setError(null);

    const createdMeeting = await createMeetingRepository(input);

    setMeetings((currentMeetings) => [createdMeeting, ...currentMeetings]);

    return createdMeeting;
  }, []);

  const updateMeeting = useCallback(async (meetingId: string, input: UpdateMeetingInput) => {
    setError(null);

    const updatedMeeting = await updateMeetingRepository(meetingId, input);

    const enrichedMeeting = enrichMeetingsWithAnalyses([updatedMeeting], selectedCompanyId)[0];

    setMeetings((currentMeetings) =>
      currentMeetings.map((meeting) =>
        meeting.id === enrichedMeeting.id ? enrichedMeeting : meeting,
      ),
    );

    return enrichedMeeting;
  }, [selectedCompanyId]);

  const deleteMeeting = useCallback(async (meetingId: string) => {
    setError(null);

    const deletedMeeting = await deleteMeetingRepository(meetingId);

    setMeetings((currentMeetings) =>
      currentMeetings.filter((meeting) => meeting.id !== deletedMeeting.id),
    );

    return deletedMeeting;
  }, []);

  return {
    meetings,
    catalog,
    selectedCompanyId,
    hasCompany: Boolean(selectedCompanyId),
    isLoading,
    movingMeetingId,
    error,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    moveMeeting,
  };
}
