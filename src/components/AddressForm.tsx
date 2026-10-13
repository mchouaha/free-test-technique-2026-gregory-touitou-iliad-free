export default function AddressForm({ default: defaultValue, id = 'address' }: { default: string; id?: string }) {
  return (
    <div className="intent-field">
      <label className="field-label" htmlFor={id}>Adresse</label>
      <input id={id} type="text" defaultValue={defaultValue} className="address-input" autoComplete="street-address" />
    </div>
  );
}
