import { ChevronDown, Filter, Search } from 'lucide-react';

export function MeetingsFilterBar() {
  return (
    <form className="meetings-filter-bar" role="search" aria-label="Filtrar reuniões">
      <label className="meetings-filter-bar__search">
        <Search size={16} aria-hidden="true" />
        <span className="sr-only">Buscar reunião</span>
        <input type="search" name="search" placeholder="Buscar reunião" />
      </label>

      <div className="meetings-filter-bar__sort">
        <span>Ordenar por:</span>
        <label>
          <span className="sr-only">Critério de ordenação</span>
          <select name="sortBy" defaultValue="stage">
            <option value="stage">Status</option>
            <option value="date">Data</option>
            <option value="signals">Sinais</option>
          </select>
          <ChevronDown size={15} aria-hidden="true" />
        </label>
      </div>

      <button className="meetings-filter-bar__button" type="button">
        <Filter size={15} aria-hidden="true" />
        Filtro
      </button>
    </form>
  );
}
