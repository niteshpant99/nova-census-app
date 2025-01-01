// app/denied/page.tsx
export default function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Access Denied</h1>
        <p className="mt-2">You don&apos;t have permission to access this page</p>
      </div>
    </div>
  );
}