'use client';

import { ChevronDown, Filter, Search } from 'lucide-react';

const productOptions = [
  { value: 'premium-plan', label: 'Plano Premium' },
  { value: 'product-x', label: 'Produto X' },
  { value: 'product-y', label: 'Produto Y' },
] as const;

export function PersonaProductFilter() {
  return (
    <form
      className="persona-product-filter"
      role="search"
      aria-label="Filtrar persona por produto"
      onSubmit={(event) => event.preventDefault()}
    >
      <span className="persona-product-filter__label">Produtos</span>

      <label className="persona-product-filter__search">
        <Search size={15} aria-hidden="true" />
        <span className="sr-only">Buscar produto</span>
        <input type="search" name="productSearch" placeholder="Buscar produto" />
      </label>

      <label className="persona-product-filter__select">
        <span className="sr-only">Produto analisado</span>
        <select name="product" defaultValue="premium-plan">
          {productOptions.map((product) => (
            <option key={product.value} value={product.value}>
              {product.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} aria-hidden="true" />
      </label>

      <button className="persona-product-filter__button" type="submit">
        <Filter size={15} aria-hidden="true" />
        Filtrar
      </button>
    </form>
  );
}
