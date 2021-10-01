import {
  createSolidDataset,
  getSolidDataset,
  saveSolidDatasetAt,
  createThing,
  getThing,
  addUrl,
  getSourceUrl,
  getUrl,
  setThing,
} from "@inrupt/solid-client";

import { solid, rdf, schema } from 'rdf-namespaces';


export async function getOrCreateDataset(containerUri, fetch, publicTypeIndexUri) {

  const publicTypeIndex = await getSolidDataset(publicTypeIndexUri);

  const articleListThing = getThing(publicTypeIndex, "https://carlotosoni99.inrupt.net/settings/publicTypeIndex.ttl#articlelist");

  if ( articleListThing === null ) {
    try{
      const articlelistUri = containerUri + "articlelist.ttl";
      return await initialiseArticlelist(articlelistUri, fetch, publicTypeIndex, publicTypeIndexUri);
    }
    catch(e) {
      console.log("an error occurr")
      console.log(e);
    }
  }

  const articlelistUri = getUrl(articleListThing, solid.instance);

  return await getSolidDataset(articlelistUri);
}


async function initialiseArticlelist (articlelistUri, fetch, publicTypeIndex, publicTypeIndexUri) {

  const listPublicType = getThing(
    publicTypeIndex,
    publicTypeIndexUri,
  );

  const listPublicTypeWithRef = addUrl(
    listPublicType,
    "http://purl.org/dc/terms/references",
    articlelistUri,
  );

  const uploadedPublicTypeIndexRef = setThing(
    publicTypeIndex,
    listPublicTypeWithRef,
  );

  const newPublicTypeIndex = await saveSolidDatasetAt(
    publicTypeIndexUri,
    uploadedPublicTypeIndexRef,
    {
      fetch: fetch,
    },
  )

  const articlelistDataset = await saveSolidDatasetAt(
    articlelistUri,
    createSolidDataset(),
    {
    fetch: fetch,
    },
  );

  const newPublicThing = createThing({url: "https://carlotosoni99.inrupt.net/settings/publicTypeIndex.ttl#articlelist"});

  const thingWithType = addUrl(
    newPublicThing,
    rdf.type,
    solid.TypeRegistration,
  );

  const thingWithForClass = addUrl(
    thingWithType,
    solid.forClass,
    schema.TextDigitalDocument
  );

  const thingWithInstance = addUrl(
    thingWithForClass,
    solid.instance,
    getSourceUrl(articlelistDataset),
  );

  const uploadedPublicTypeIndex = setThing(
    newPublicTypeIndex,
    thingWithInstance,
  );

  await saveSolidDatasetAt(
    publicTypeIndexUri,
    uploadedPublicTypeIndex,
    {
      fetch: fetch,
    },  
  );

  return articlelistDataset;
}