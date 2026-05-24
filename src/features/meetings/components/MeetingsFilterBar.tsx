import { ChevronDown, RotateCcw, Search } from 'lucide-react';
import type { MeetingFilters } from '../types/meeting';

type FilterOption = {
  label: string;
  value: string;
};

type MeetingsFilterBarProps = {
  filters: MeetingFilters;
  hasActiveFilters: boolean;
  participantOptions: FilterOption[];
  productOptions: FilterOption[];
  onChange: <Field extends keyof MeetingFilters>(field: Field, value: MeetingFilters[Field]) => void;
  onReset: () => void;
};

export function MeetingsFilterBar({
  filters,
  hasActiveFilters,
  participantOptions,
  productOptions,
  onChange,
  onReset,
}: MeetingsFilterBarProps) {
  return (
    <form
      className="meetings-filter-bar"
      onSubmit={(event) => event.preventDefault()}
      role="search"
      aria-label="Filtrar reunioes"
    >
      <label className="meetings-filter-bar__search">
        <Search size={16} aria-hidden="true" />
        <span className="sr-only">Buscar reuniao</span>
        <input
          type="search"
          name="search"
          placeholder="Buscar por titulo, pessoa, produto ou serviço"
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
        />
      </label>

      <label className="meetings-filter-bar__select">
        <span>Status</span>
        <select
          name="status"
          value={filters.status}
          onChange={(event) => onChange('status', event.target.value as MeetingFilters['status'])}
        >
          <option value="all">Todos</option>
          <option value="scheduled">Agendadas</option>
          <option value="in-review">Em analise</option>
          <option value="decided">Decididas</option>
          <option value="analyzed">Analisadas</option>
        </select>
        <ChevronDown size={15} aria-hidden="true" />
      </label>

      <label className="meetings-filter-bar__select">
        <span>Produto, serviço ou linha</span>
        <select
          name="product"
          value={filters.product}
          onChange={(event) => onChange('product', event.target.value)}
        >
          <option value="all">Todos</option>
          {productOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={15} aria-hidden="true" />
      </label>

      <label className="meetings-filter-bar__select">
        <span>Pessoa</span>
        <select
          name="participant"
          value={filters.participant}
          onChange={(event) => onChange('participant', event.target.value)}
        >
          <option value="all">Todas</option>
          {participantOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={15} aria-hidden="true" />
      </label>

      <label className="meetings-filter-bar__select">
        <span>Periodo</span>
        <select
          name="period"
          value={filters.period}
          onChange={(event) => onChange('period', event.target.value as MeetingFilters['period'])}
        >
          <option value="all">Todos</option>
          <option value="today">Hoje</option>
          <option value="upcoming">Proximas</option>
          <option value="past">Passadas</option>
          <option value="next-7">7 dias</option>
          <option value="next-30">30 dias</option>
        </select>
        <ChevronDown size={15} aria-hidden="true" />
      </label>

      <label className="meetings-filter-bar__select">
        <span>Sinais</span>
        <select
          name="signals"
          value={filters.signals}
          onChange={(event) => onChange('signals', event.target.value as MeetingFilters['signals'])}
        >
          <option value="all">Todos</option>
          <option value="none">Sem sinais</option>
          <option value="with-signals">Com sinais</option>
          <option value="high-signals">10+ sinais</option>
        </select>
        <ChevronDown size={15} aria-hidden="true" />
      </label>

      <label className="meetings-filter-bar__select">
        <span>Ordenar</span>
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={(event) => onChange('sortBy', event.target.value as MeetingFilters['sortBy'])}
        >
          <option value="stage">Etapa</option>
          <option value="date-asc">Data crescente</option>
          <option value="date-desc">Data decrescente</option>
          <option value="signals-desc">Mais sinais</option>
          <option value="signals-asc">Menos sinais</option>
          <option value="title">Titulo</option>
        </select>
        <ChevronDown size={15} aria-hidden="true" />
      </label>

      {hasActiveFilters ? (
        <button className="meetings-filter-bar__button" onClick={onReset} type="button">
          <RotateCcw size={15} aria-hidden="true" />
          Limpar
        </button>
      ) : null}
    </form>
  );
}
