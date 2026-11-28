import type { Metadata } from 'next';

import { HomeView } from '@/components/miles/home-view';
import { getRadarLive, todayKey } from '@/data/radar';
import {
  cheapestFrom,
  homeOrigins,
  openCampaigns,
  openPromos,
  starStatuses,
  watchStatuses,
} from '@/lib/miles/home';
import { getUserData } from '@/server/queries/user-docs';
import { getViewer } from '@/server/queries/viewer';

export const metadata: Metadata = { title: 'Visão geral' };

export default async function OverviewPage() {
  const [radar, user, viewer] = await Promise.all([
    getRadarLive(),
    getUserData(),
    getViewer(),
  ]);
  const today = todayKey();

  return (
    <HomeView
      now={new Date()}
      firstName={viewer.firstName}
      meta={radar.meta}
      promos={openPromos(radar, today)}
      campaigns={openCampaigns(radar, today)}
      cheapest={cheapestFrom(radar, homeOrigins, today, 6)}
      stars={starStatuses(radar, user.estrelas, today)}
      watches={watchStatuses(radar, user.vigias, today)}
    />
  );
}
