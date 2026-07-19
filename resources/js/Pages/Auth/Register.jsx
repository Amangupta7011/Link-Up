import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <AuthLayout title="Create an account">
            <Head title="Register" />
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Full Name</label>
                    <div className="mt-1">
                        <input
                            type="text"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                        />
                    </div>
                    {errors.name && <div className="mt-1 text-sm text-red-500">{errors.name}</div>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">Username</label>
                    <div className="mt-1">
                        <input
                            type="text"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                            value={data.username}
                            onChange={e => setData('username', e.target.value)}
                        />
                    </div>
                    {errors.username && <div className="mt-1 text-sm text-red-500">{errors.username}</div>}
                </div>

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
                    {errors.email && <div className="mt-1 text-sm text-red-500">{errors.email}</div>}
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
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
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300">Confirm</label>
                        <div className="mt-1">
                            <input
                                type="password"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {errors.password && <div className="mt-1 text-sm text-red-500">{errors.password}</div>}

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 focus:ring-offset-gray-900 transition-all disabled:opacity-50"
                    >
                        Create Account
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-brand-500 hover:text-brand-400 transition-colors">
                    Log in
                </Link>
            </div>
        </AuthLayout>
    );
}
