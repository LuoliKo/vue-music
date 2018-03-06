import Vue from 'vue';
import Router from 'vue-router';
import Disc from 'components/disc/disc';
import Rank from 'components/rank/rank';
import Collection from 'components/collection/collection';
import Sheet from 'components/sheet/sheet';
import Chat from 'components/chat/chat';
import Singer from 'components/singer/singer';
import Detail from 'components/detail/detail';
import Search from 'components/search/search';
import SearchSong from 'components/search-song/search-song';
import SearchSheet from 'components/search-sheet/search-sheet';
import SearchSinger from 'components/search-singer/search-singer';
import SearchLyric from 'components/search-lyric/search-lyric';
import MenuDetail from 'components/menu-detail/menu-detail';
import CollectSong from 'components/collect-song/collect-song';
import CollectSheet from 'components/collect-sheet/collect-sheet';
import PlayHistory from 'components/play-history/play-history';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/disc'
    },
    {
      path: '/disc',
      component: Disc,
      children: [
        {
          path: '/disc',
          redirect: '/disc/sheet'
        },
        {
          path: '/disc/sheet',
          component: Sheet,
          children: [
            {
              path: ':id',
              component: Detail,
              children: [
                {
                  path: ':id',
                  component: MenuDetail
                }
              ]
            }
          ]
        },
        {
          path: '/disc/rank',
          component: Rank,
          children: [
            {
              path: ':id',
              component: Detail,
              children: [
                {
                  path: ':id',
                  component: MenuDetail
                }
              ]
            }
          ]
        },
        {
          path: '/disc/singer',
          component: Singer,
          children: [
            {
              path: ':id',
              component: Detail,
              children: [
                {
                  path: ':id',
                  component: MenuDetail
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/chat',
      component: Chat
    },
    {
      path: '/collection',
      component: Collection,
      children: [
        {
          path: '/collection',
          redirect: '/collection/song'
        },
        {
          path: '/collection/song',
          component: CollectSong,
          children: [
            {
              path: ':id',
              component: MenuDetail
            }
          ]
        },
        {
          path: '/collection/sheet',
          component: CollectSheet,
          children: [
            {
              path: ':id',
              component: Detail,
              children: [
                {
                  path: ':id',
                  component: MenuDetail
                }
              ]
            }
          ]
        },
        {
          path: '/collection/history',
          component: PlayHistory,
          children: [
            {
              path: ':id',
              component: MenuDetail
            }
          ]
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: '/search/song',
          component: SearchSong,
          children: [
            {
              path: ':id',
              component: MenuDetail
            }
          ]
        },
        {
          path: '/search/sheet',
          component: SearchSheet,
          children: [
            {
              path: ':id',
              component: Detail,
              children: [
                {
                  path: ':id',
                  component: MenuDetail
                }
              ]
            }
          ]
        },
        {
          path: '/search/singer',
          component: SearchSinger,
          children: [
            {
              path: ':id',
              component: Detail,
              children: [
                {
                  path: ':id',
                  component: MenuDetail
                }
              ]
            }
          ]
        },
        {
          path: '/search/lyric',
          component: SearchLyric
        }
      ]
    }
  ],
  linkActiveClass: 'active'
});
