export default function SessionPhoto({ session, loading = 'lazy' }) {
  return (
    <img
      className="session-photo"
      src={session.image}
      alt={session.imageAlt}
      loading={loading}
      decoding="async"
    />
  );
}
