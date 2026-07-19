import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <AuthLayout title="Sign in to your account">
            <Head title="Login" />
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Email address</label>
                    <div className="mt-1">
                        <input
                            type="email"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                        />
                    </div>
                    {errors.email && <div className="mt-2 text-sm text-red-500">{errors.email}</div>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">Password</label>
                    <div className="mt-1">
                        <input
                            type="password"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                        />
                    </div>
                    {errors.password && <div className="mt-2 text-sm text-red-500">{errors.password}</div>}
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 focus:ring-offset-gray-900 transition-all disabled:opacity-50"
                    >
                        Sign in
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link href="/register" className="font-medium text-brand-500 hover:text-brand-400 transition-colors">
                    Register here
                </Link>
            </div>
        </AuthLayout>
    );
}
