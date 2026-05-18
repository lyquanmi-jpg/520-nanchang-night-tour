export default function FragmentToast({ message }) {
  if (!message) return null;

  return (
    <div className="fragment-toast">
      <span className="toast-spark" />
      <span>{message}</span>
    </div>
  );
}
