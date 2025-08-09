// app/profile/_components/profile-header.tsx
export default function ProfileHeader({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-gray-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
        </svg>
      </div>
      <p className="mt-4 font-semibold text-lg">{name}</p>
    </div>
  );
}
