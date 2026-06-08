import { RegisterForm } from '../components/auth/RegisterForm';

export default function Register() {
  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-900 p-6">
        <h1 className="mb-6 text-center text-2xl font-bold">Join RoyaltyFlux</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
