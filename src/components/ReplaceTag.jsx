/** Small visible marker on entries that still contain placeholder data. Remove "placeholder": true in the JSON to hide it. */
export default function ReplaceTag() {
  return (
    <span className="replace-tag" title='Placeholder — edit the JSON entry and remove "placeholder": true'>
      [REPLACE ME]
    </span>
  );
}
