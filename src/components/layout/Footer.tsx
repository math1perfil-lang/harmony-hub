import { TenantLink as Link } from '@/components/TenantLink';
import { useHouse } from '@/contexts/HouseContext';
import { Shield, Heart } from 'lucide-react';

export function Footer() {
  const { house } = useHouse();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              {house?.logo_url ? (
                <img 
                  src={house.logo_url} 
                  alt={house.name} 
                  className="h-10 w-auto"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-foreground">
                    {house?.name?.charAt(0) || 'E'}
                  </span>
                </div>
              )}
              <span className="font-display text-xl font-semibold">
                {house?.name || 'Event House'}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              {house?.description || 'Plataforma exclusiva para eventos privados. Conectando pessoas com respeito, discrição e segurança.'}
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-success" />
                Privacidade garantida
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-primary" />
                Ambiente seguro
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Institucional</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/regras" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Regras e Conduta
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Agenda de Eventos
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-4">Conta</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Entrar
                </Link>
              </li>
              <li>
                <Link to="/cadastro" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Criar Conta
                </Link>
              </li>
              <li>
                <Link to="/assinatura" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Assinatura
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {house?.name || 'Event House'}. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/privacidade" className="hover:text-foreground transition-colors">
              Privacidade
            </Link>
            <Link to="/termos" className="hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
