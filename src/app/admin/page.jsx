import AdminLoginForm from './AdminLoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage({ searchParams }) {
    const params = await searchParams;
    const requestedCallbackUrl = params?.callbackUrl;
    const callbackUrl =
        typeof requestedCallbackUrl === 'string' &&
        requestedCallbackUrl.startsWith('/') &&
        !requestedCallbackUrl.startsWith('//')
            ? requestedCallbackUrl
            : '/admin/dashboard';

    return <AdminLoginForm callbackUrl={callbackUrl} />;
}