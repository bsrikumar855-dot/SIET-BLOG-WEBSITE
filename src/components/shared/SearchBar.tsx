type SearchBarProps = {
  label?: string;
  placeholder?: string;
  name?: string;
  action?: string;
};

export function SearchBar({
  label = "Search",
  placeholder = "Search the archive",
  name = "q",
  action = "/search",
}: SearchBarProps) {
  return (
    <form className="search-bar" action={action}>
      <label className="sr-only" htmlFor="site-search">
        {label}
      </label>
      <input id="site-search" name={name} placeholder={placeholder} type="search" />
      <button type="submit">Search</button>
    </form>
  );
}
