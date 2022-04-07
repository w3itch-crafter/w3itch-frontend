/**
 * calc rating
 * @param rating 100 - 500
 * @returns 1 - 5
 */
export const calcRating = (rating: number) => parseInt(String(rating / 100))
