
import { SITE } from "~/config.mjs";

export default async (type) => {
	const data = await fetch(`${SITE.apiUrl}/${type}.json`).then((response) =>
    response.json()
  );

  return data.map((item) => {
    return {
      params: { id: item.id },
    };
  });
}