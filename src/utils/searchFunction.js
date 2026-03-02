export function searchFunction({ dispatch, query, perform }) {
  const param = query ? query.trim() : null;
  dispatch(perform(param));
}
