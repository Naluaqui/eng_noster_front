'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getMeetings } from '@/features/meetings/repositories/meetings.repository';
import type { Meeting } from '@/features/meetings/types/meeting';
import {
  getSelectedCompanyId,
  selectedCompanyChangedEvent,
} from '@/features/settings/repositories/workspace.repository';
import { getMultiAgentWorkspace } from '../repositories/multi-agents.repository';
import type { AgentAnalysis, MultiAgentMeetingAttachment, MultiAgentMessage } from '../types/multiAgent';

type MessagesByAnalysis = Record<string, MultiAgentMessage[]>;
type AttachmentsByAnalysis = Record<string, string[]>;
type StoredMultiAgentWorkspace = {
  activeAnalysisId: string | null;
  analyses: AgentAnalysis[];
  attachmentsByAnalysis: AttachmentsByAnalysis;
  messagesByAnalysis: MessagesByAnalysis;
};

function getStorageKey(companyId: string) {
  return `noster.multiAgents.${companyId}`;
}

function getStoredWorkspace(companyId: string): StoredMultiAgentWorkspace | null {
  try {
    const storedWorkspace = window.localStorage.getItem(getStorageKey(companyId));

    return storedWorkspace ? (JSON.parse(storedWorkspace) as StoredMultiAgentWorkspace) : null;
  } catch {
    return null;
  }
}

function saveStoredWorkspace(companyId: string, workspace: StoredMultiAgentWorkspace) {
  window.localStorage.setItem(getStorageKey(companyId), JSON.stringify(workspace));
}

function createClientId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function mapMeetingToAttachment(meeting: Meeting): MultiAgentMeetingAttachment {
  return {
    id: meeting.id,
    title: meeting.title,
    date: meeting.date,
    time: meeting.time,
    summary: meeting.summary,
  };
}

function createWelcomeMessage(content: string): MultiAgentMessage {
  return {
    id: createClientId('message'),
    role: 'agent',
    agent: 'Estrategista',
    content,
  };
}

export function useMultiAgents() {
  const [analyses, setAnalyses] = useState<AgentAnalysis[]>([]);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [messagesByAnalysis, setMessagesByAnalysis] = useState<MessagesByAnalysis>({});
  const [attachmentsByAnalysis, setAttachmentsByAnalysis] = useState<AttachmentsByAnalysis>({});
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMultiAgents = useCallback(async () => {
    const companyId = getSelectedCompanyId();

    try {
      setIsLoading(true);
      setError(null);
      setSelectedCompanyId(companyId);

      if (!companyId) {
        setAnalyses([]);
        setActiveAnalysisId(null);
        setMessagesByAnalysis({});
        setAttachmentsByAnalysis({});
        setMeetings([]);
        return;
      }

      const [workspace, meetingsData] = await Promise.all([getMultiAgentWorkspace(), getMeetings()]);
      const storedWorkspace = getStoredWorkspace(companyId);
      const activeAnalysis = workspace.analyses.find((analysis) => analysis.status === 'active');
      const nextActiveAnalysisId =
        storedWorkspace?.activeAnalysisId ?? activeAnalysis?.id ?? workspace.analyses[0]?.id ?? null;
      const nextMessagesByAnalysis =
        storedWorkspace?.messagesByAnalysis ??
        workspace.analyses.reduce<MessagesByAnalysis>(
          (messagesMap, analysis) => ({
            ...messagesMap,
            [analysis.id]:
              analysis.id === nextActiveAnalysisId
                ? workspace.messages
                : [
                    createWelcomeMessage(
                      `Chat "${analysis.title}" pronto. Anexe uma reuniao ou descreva a decisao que voce quer analisar.`,
                    ),
                  ],
          }),
          {},
        );

      setAnalyses(storedWorkspace?.analyses ?? workspace.analyses);
      setActiveAnalysisId(nextActiveAnalysisId);
      setMessagesByAnalysis(nextMessagesByAnalysis);
      setAttachmentsByAnalysis(storedWorkspace?.attachmentsByAnalysis ?? {});
      setMeetings(meetingsData);
    } catch {
      setError('Nao foi possivel carregar os agentes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadMultiAgents);
  }, [loadMultiAgents]);

  useEffect(() => {
    window.addEventListener(selectedCompanyChangedEvent, loadMultiAgents);

    return () => {
      window.removeEventListener(selectedCompanyChangedEvent, loadMultiAgents);
    };
  }, [loadMultiAgents]);

  useEffect(() => {
    if (!selectedCompanyId || isLoading) {
      return;
    }

    saveStoredWorkspace(selectedCompanyId, {
      activeAnalysisId,
      analyses,
      attachmentsByAnalysis,
      messagesByAnalysis,
    });
  }, [activeAnalysisId, analyses, attachmentsByAnalysis, isLoading, messagesByAnalysis, selectedCompanyId]);

  const activeAnalysis = useMemo(
    () => analyses.find((analysis) => analysis.id === activeAnalysisId) ?? null,
    [activeAnalysisId, analyses],
  );

  const messages = activeAnalysisId ? (messagesByAnalysis[activeAnalysisId] ?? []) : [];
  const attachedMeetingIds = useMemo(
    () => (activeAnalysisId ? (attachmentsByAnalysis[activeAnalysisId] ?? []) : []),
    [activeAnalysisId, attachmentsByAnalysis],
  );
  const attachedMeetings = useMemo(
    () => meetings.filter((meeting) => attachedMeetingIds.includes(meeting.id)),
    [attachedMeetingIds, meetings],
  );

  const createAnalysis = useCallback(() => {
    const analysisId = createClientId('analise');
    const newAnalysis: AgentAnalysis = {
      id: analysisId,
      title: 'Novo chat',
      description: 'Conversa aberta para uma nova decisao.',
      status: 'active',
      agentCount: 4,
    };

    setAnalyses((currentAnalyses) => [
      newAnalysis,
      ...currentAnalyses.map((analysis) =>
        analysis.status === 'active' ? { ...analysis, status: 'draft' as const } : analysis,
      ),
    ]);
    setActiveAnalysisId(analysisId);
    setMessagesByAnalysis((currentMessages) => ({
      ...currentMessages,
      [analysisId]: [
        createWelcomeMessage(
          'Novo chat iniciado. Anexe uma reuniao ou escreva o que voce quer que os agentes analisem.',
        ),
      ],
    }));
    setAttachmentsByAnalysis((currentAttachments) => ({
      ...currentAttachments,
      [analysisId]: [],
    }));
  }, []);

  const selectAnalysis = useCallback((analysisId: string) => {
    setActiveAnalysisId(analysisId);
  }, []);

  const attachMeeting = useCallback(
    (meetingId: string) => {
      if (!activeAnalysisId) {
        return;
      }

      setAttachmentsByAnalysis((currentAttachments) => {
        const currentMeetingIds = currentAttachments[activeAnalysisId] ?? [];

        if (currentMeetingIds.includes(meetingId)) {
          return currentAttachments;
        }

        return {
          ...currentAttachments,
          [activeAnalysisId]: [...currentMeetingIds, meetingId],
        };
      });
    },
    [activeAnalysisId],
  );

  const detachMeeting = useCallback(
    (meetingId: string) => {
      if (!activeAnalysisId) {
        return;
      }

      setAttachmentsByAnalysis((currentAttachments) => ({
        ...currentAttachments,
        [activeAnalysisId]: (currentAttachments[activeAnalysisId] ?? []).filter((id) => id !== meetingId),
      }));
    },
    [activeAnalysisId],
  );

  const sendMessage = useCallback(
    (content: string) => {
      if (!activeAnalysisId) {
        return;
      }

      const normalizedContent = content.trim();

      if (!normalizedContent && attachedMeetings.length === 0) {
        return;
      }

      const attachments = attachedMeetings.map(mapMeetingToAttachment);
      const meetingContext =
        attachments.length > 0
          ? `\n\nReunioes anexadas: ${attachments.map((meeting) => meeting.title).join(', ')}.`
          : '';
      const userMessage: MultiAgentMessage = {
        id: createClientId('message'),
        role: 'user',
        content: `${normalizedContent || 'Analise as reunioes anexadas.'}${meetingContext}`,
        attachments,
      };
      const agentMessage: MultiAgentMessage = {
        id: createClientId('message'),
        role: 'agent',
        agent: attachments.length > 0 ? 'Agentes + Reunioes' : 'Agentes',
        content:
          attachments.length > 0
            ? `Recebi ${attachments.length} reuniao(oes) como contexto. Vou cruzar sinais, decisoes pendentes e riscos antes de sugerir o proximo passo.`
            : 'Recebi seu pedido. Vou analisar pelas perspectivas de cliente, razao, financeiro e narrativa.',
      };

      setMessagesByAnalysis((currentMessages) => ({
        ...currentMessages,
        [activeAnalysisId]: [...(currentMessages[activeAnalysisId] ?? []), userMessage, agentMessage],
      }));

      setAnalyses((currentAnalyses) =>
        currentAnalyses.map((analysis) =>
          analysis.id === activeAnalysisId
            ? {
                ...analysis,
                title: normalizedContent ? normalizedContent.slice(0, 42) : 'Analise de reunioes',
                description:
                  attachments.length > 0
                    ? `${attachments.length} reuniao(oes) anexada(s) como contexto.`
                    : 'Pedido enviado para os agentes.',
              }
            : analysis,
        ),
      );
    },
    [activeAnalysisId, attachedMeetings],
  );

  return {
    data: activeAnalysis
      ? {
          analyses,
          activeAnalysis,
          activeAnalysisId: activeAnalysisId ?? activeAnalysis.id,
          attachedMeetings,
          meetings,
          messages,
          selectedCompanyId,
        }
      : null,
    isLoading,
    error,
    attachMeeting,
    createAnalysis,
    detachMeeting,
    selectAnalysis,
    sendMessage,
  };
}
