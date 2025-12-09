import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, LogOut, User as UserIcon, X, Mail } from 'lucide-react';

export const LoginButton = () => {
    const { user, signInWithEmail, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmail(email);
            setSent(true);
        } catch (error) {
            alert('Erro ao enviar link de login. Verifique o email.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        return (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                    {user.user_metadata.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-600" />
                    ) : (
                        <UserIcon size={20} />
                    )}
                    <span className="hidden sm:inline">{user.user_metadata.full_name || user.email}</span>
                </div>
                <button 
                    onClick={signOut} 
                    className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition"
                    title="Sair"
                >
                    <LogOut size={18} />
                </button>
            </div>
        );
    }

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition border border-slate-700"
            >
                <LogIn size={16} /> Entrar
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-slate-800 p-6 rounded-lg w-full max-w-sm border border-slate-700 shadow-2xl relative animate-fade-in">
                        <button 
                            onClick={() => { setIsOpen(false); setSent(false); }} 
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
                        >
                            <X size={20} />
                        </button>
                        
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <LogIn className="text-amber-500" /> Entrar / Cadastrar
                        </h2>
                        
                        {sent ? (
                            <div className="text-center py-4 animate-fade-in">
                                <div className="bg-green-500/10 text-green-400 p-4 rounded mb-4 border border-green-500/20">
                                    Link enviado para <b>{email}</b>!
                                </div>
                                <p className="text-sm text-slate-300 mb-4">
                                    Verifique sua caixa de entrada (e spam) e clique no link para entrar automaticamente.
                                </p>
                                <button 
                                    onClick={() => setSent(false)} 
                                    className="text-amber-500 hover:text-amber-400 text-sm font-medium transition"
                                >
                                    Tentar outro email
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Seu Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                                        <input 
                                            type="email" 
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition"
                                            placeholder="nome@exemplo.com"
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition shadow-lg hover:shadow-amber-900/20"
                                >
                                    {loading ? 'Enviando...' : 'Enviar Link Mágico'}
                                </button>
                                <p className="text-xs text-center text-slate-500 mt-4 px-4">
                                    Enviaremos um link de acesso seguro para o seu email. Não é necessário criar senha.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
