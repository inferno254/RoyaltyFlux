import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Music, Zap, Shield, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-950 via-gray-950 to-gray-950 px-4 py-20 text-center">
        <Badge className="mx-auto mb-4">Built for East African Artists</Badge>
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
          Constant Royalty Flow
          <span className="block bg-gradient-to-r from-brand-500 to-gold-400 bg-clip-text text-transparent">
            Artists Get Paid in 5 Minutes
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
          Mint your songs as NFTs on Avalanche. Smart contracts auto-split royalties.
          Get paid instantly to M-Pesa. No more 6-month waits or 80% middlemen cuts.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/register"><Button size="lg">Start Earning <ArrowRight size={18} /></Button></Link>
          <Link to="/explore"><Button size="lg" variant="outline">Explore Music</Button></Link>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-gray-950 px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <Card>
            <CardBody>
              <p className="text-sm text-gray-400">Reality</p>
              <p className="text-3xl font-bold text-white">KES 50,000</p>
              <p className="text-sm text-gray-400">Sauti Sol — 10M streams</p>
            </CardBody>
          </Card>
          <Card className="border-brand-700">
            <CardBody>
              <p className="text-sm text-brand-300">What they should earn</p>
              <p className="text-3xl font-bold text-brand-400">KES 5,000,000</p>
              <p className="text-sm text-gray-400">100x more with RoyaltyFlux</p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-900/40 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-3xl font-bold">How it works</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { icon: Music, title: 'Upload', desc: 'Upload your song to IPFS' },
              { icon: Shield, title: 'Mint NFT', desc: 'Smart contract locks splits' },
              { icon: Zap, title: 'Stream', desc: 'Every play is verified' },
              { icon: ArrowRight, title: 'Paid', desc: 'M-Pesa in 5 minutes' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <Card key={title} className="text-center">
                <Icon className="mx-auto mb-3 h-10 w-10 text-brand-500" />
                <p className="text-xs text-gray-500">Step {i + 1}</p>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm text-gray-400">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-gray-950 to-brand-950 px-4 py-20 text-center">
        <h2 className="text-3xl font-bold">Ready to get paid what you deserve?</h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-300">
          Join the artists already earning through RoyaltyFlux. Built in Ongata Rongai, Kajiado County 🇰🇪
        </p>
        <div className="mt-6">
          <Link to="/register"><Button size="lg">Create free account</Button></Link>
        </div>
      </section>
    </div>
  );
}
