
import { SITE } from "~/config.mjs";

export default async (type, id = 'id') => {
	let data = await fetch(`${SITE.apiUrl}/${type}.json`).then((response) =>
    response.json()
  );

  const scope = import.meta.env.COUNTRY_SCOPE
  if(scope !== 'all') {
    data = data.filter(item => {return item.ci == scope})
  }

  return data.map((item) => {
    return {
      params: { id: item[id] },
    };
  });
}