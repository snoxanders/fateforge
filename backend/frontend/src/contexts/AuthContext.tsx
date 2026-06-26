import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

// No app nativo, o redirect do login precisa ser um deep link (esquema custom),
// pois window.location.origin vira "localhost". Na web, usa a própria origem.
const NATIVE = Capacitor.isNativePlatform();
const REDIRECT_TO = NATIVE
    ? 'app.charvo://auth'
    : (typeof window !== 'undefined' ? window.location.origin : undefined);

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // No app nativo: captura a sessão quando o link mágico abre o app via deep link.
        let removeDeepLink: (() => void) | undefined;
        if (NATIVE) {
            const handlePromise = App.addListener('appUrlOpen', async ({ url }) => {
                if (!url || !url.includes('auth')) return;
                // fecha o navegador do sistema (fluxo do Google) ao voltar pro app
                try { const { Browser } = await import('@capacitor/browser'); await Browser.close(); } catch { /* noop */ }
                try {
                    const hash = url.split('#')[1];
                    if (hash) {
                        const params = new URLSearchParams(hash);
                        const access_token = params.get('access_token');
                        const refresh_token = params.get('refresh_token');
                        if (access_token && refresh_token) {
                            await supabase.auth.setSession({ access_token, refresh_token });
                            return;
                        }
                    }
                    const code = url.includes('code=') ? new URL(url).searchParams.get('code') : null;
                    if (code) await supabase.auth.exchangeCodeForSession(code);
                } catch (e) {
                    console.error('Deep link auth error:', e);
                }
            });
            removeDeepLink = () => { handlePromise.then(h => h.remove()); };
        }

        return () => {
            subscription.unsubscribe();
            if (removeDeepLink) removeDeepLink();
        };
    }, []);

    const signInWithGoogle = async () => {
        if (NATIVE) {
            // No app: abre o login do Google no navegador do sistema e volta via deep link.
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: REDIRECT_TO, skipBrowserRedirect: true },
            });
            if (error) { console.error('Login error:', error); return; }
            if (data?.url) {
                const { Browser } = await import('@capacitor/browser');
                await Browser.open({ url: data.url });
            }
        } else {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: REDIRECT_TO },
            });
            if (error) console.error('Login error:', error);
        }
    };

    const signInWithEmail = async (email: string) => {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: REDIRECT_TO }
        });
        if (error) throw error;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Logout error:", error);
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signInWithEmail, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
