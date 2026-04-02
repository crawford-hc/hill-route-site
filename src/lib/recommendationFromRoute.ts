import type { RecommendationBlock, RouteJson } from '../types/route'

export function recommendationFromRoute(route: RouteJson): RecommendationBlock | null {
  if (route.recommendationBlock) return route.recommendationBlock
  if (route.recommendation?.length) {
    return { title: 'Rough take', lines: route.recommendation }
  }
  return null
}
