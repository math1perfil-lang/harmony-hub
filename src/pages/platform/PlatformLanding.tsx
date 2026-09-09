import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Globe, LayoutDashboard, Shield } from 'lucide-react';

export default function PlatformLanding() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-semibold text-gradient">
            Velvet Platform
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/casas">Casas</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild className="bg-gradient-primary hover:opacity-90">
              <Link to="/criar-casa">Criar minha casa</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              A plataforma completa para <span className="text-gradient">casas de eventos privados</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Cada casa ganha seu próprio site, seu endereço exclusivo e um painel de gestão completo —
              com dados dos frequentadores totalmente isolados entre as casas.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90 shadow-glow">
                <Link to="/criar-casa">
                  Cadastrar minha casa
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/casas">Ver casas na plataforma</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-card/30">
          <div className="container mx-auto px-4 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Globe, title: 'Endereço próprio', text: 'Cada casa recebe um endereço público exclusivo para divulgar aos seus clientes.' },
              { icon: LayoutDashboard, title: 'Painel de gestão', text: 'Eventos, textos, regras, fotos e identidade visual editáveis a qualquer momento.' },
              { icon: Building2, title: 'Comunidade por casa', text: 'Cadastro de frequentadores, listas de eventos e área social exclusiva.' },
              { icon: Shield, title: 'Dados isolados', text: 'Nenhum dado de uma casa é visível para outra. Privacidade em primeiro lugar.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="p-6 rounded-xl bg-card border border-border/50 hover-lift">
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} Velvet Platform. Acesso restrito a maiores de 18 anos.
        </div>
      </footer>
    </div>
  );
}
