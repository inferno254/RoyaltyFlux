# Deployment

## Production checklist

### Smart contracts
- [ ] Audited by reputable firm
- [ ] Testnet deployed for >30 days
- [ ] Bug bounty active
- [ ] Multi-sig for owner / admin
- [ ] Emergency pause tested
- [ ] SnowTrace verification

### Backend
- [ ] All env vars set in production secret store
- [ ] Database backups (daily)
- [ ] Redis persistence enabled
- [ ] Rate limits tightened
- [ ] Sentry / error monitoring active
- [ ] HTTPS enforced
- [ ] CORS allowlist correct
- [ ] M-Pesa production creds
- [ ] Pinata production account

### Frontend
- [ ] Built with production env
- [ ] CDN caching configured
- [ ] CSP headers strict
- [ ] Analytics (Plausible / Fathom)
- [ ] Error tracking

## Deploy steps

```bash
# 1. Tag release
git tag v0.1.0
git push --tags

# 2. CI builds & pushes Docker images to registry
# 3. SSH into production server
ssh prod

# 4. Pull images & restart
cd /opt/royaltyflux
export TAG=v0.1.0
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## Rollback

```bash
git checkout v0.1.0
# Re-deploy previous tag
```

## Monitoring

- **Backend**: Sentry + Pino logs to stdout (collected by Docker)
- **Contracts**: SnowTrace alerts on contract events
- **Database**: pg_stat_statements + weekly VACUUM
- **Uptime**: Better Stack / UptimeRobot
