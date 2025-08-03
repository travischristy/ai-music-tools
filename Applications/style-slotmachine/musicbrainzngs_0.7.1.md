# Table of Contents

- [MusicBrainz API - MusicBrainz](#musicbrainz-api-musicbrainz)
- [MusicBrainz - the open music encyclopedia](#musicbrainz-the-open-music-encyclopedia)
- [Installation — musicbrainzngs 0.7.1 documentation](#installation-musicbrainzngs-071-documentation)
- [Usage — musicbrainzngs 0.7.1 documentation](#usage-musicbrainzngs-071-documentation)
- [release-count is only available starting with musicbrainzngs 0.5](#release-count-is-only-available-starting-with-musicbrainzngs-05)
- [API — musicbrainzngs 0.7.1 documentation](#api-musicbrainzngs-071-documentation)
- [optionally restrict musicbrainzngs output to INFO messages](#optionally-restrict-musicbrainzngs-output-to-info-messages)
- [Index — musicbrainzngs 0.7.1 documentation](#index-musicbrainzngs-071-documentation)
- [Search — musicbrainzngs 0.7.1 documentation](#search-musicbrainzngs-071-documentation)

---

# MusicBrainz API - MusicBrainz

MusicBrainz API - MusicBrainz[](/ "MusicBrainz") ArtistEventRecordingReleaseRelease groupSeriesWorkAreaInstrumentLabelPlaceAnnotationTagCD stubEditorDocumentation  SearchThe API discussed here is an interface to the [MusicBrainz Database](/doc/MusicBrainz_Database). It is aimed at developers of media players, CD rippers, taggers, and other applications requiring music metadata. The API's architecture follows the REST design principles. Interaction with the API is done using HTTP and all content is served in a simple but flexible format, in either XML or JSON. XML is the default format; to get a JSON response, you can either set the Accept header to `"application/json"` or add `fmt=json` to the query string (if both are set, `fmt=` takes precedence). 
What can I do with the MusicBrainz API?You can look up information about a particular [MusicBrainz entity](/doc/MusicBrainz_Entity) ("give me info about The Beatles"), browse the data to find entities connected to a particular entity ("show me all releases by The Beatles"), or search for entities matching a specific query ("show me all artists matching the query 'Beatles' so I can find the one I want and ask for more data").Who can use the MusicBrainz API? Is it free?[Non-commercial](/doc/Live_Data_Feed) use of this web service is free; please see [our commercial plans](https://metabrainz.org/supporters/account-type) or [contact us](/doc/Contact_Us) if you would like to use this service commercially.Do I need an API key?Currently, no. But you must have a meaningful [user-agent string](/doc/MusicBrainz_API/Rate_Limiting#Provide_meaningful_User-Agent_strings).Do I need to provide authentication?Data submission, as well as requests that involve user information, require [digest](https://en.wikipedia.org/wiki/Digest_access_authentication) authentication.Which formats can I get the data in?The API was originally written to return XML, but nowadays it can also return JSON.Is there any significant difference between the XML and JSON APIs?For requesting data, the XML and JSON API are effectively equivalent. The XML API is the only one that allows [submitting data](/doc/MusicBrainz_API#Submitting_data) to MusicBrainz (but keep in mind only ratings, tags, barcodes and ISRCs can be submitted via the API at all; for most data additions you should use the website instead).Is there a limit to the number of requests I can make per second?**Yes**. See [our rate limiting rules](/doc/MusicBrainz_API/Rate_Limiting).This seems very complicated, can I see some examples?Yes, we have [an example page](/doc/MusicBrainz_API/Examples) showcasing some queries and showing the returned format you can expect for each.Are there language bindings for the API?Yes, in many different languages. See [our list of external libraries](/doc/MusicBrainz_API#Libraries).What should I do if I encounter unexpected behaviour not covered in these docs?You can ask question in [IRC](/doc/IRC) or in the [forums](https://community.metabrainz.org/).Check to see if a ticket has been filed in the [bug tracker](https://tickets.metabrainz.org/issues/?jql=project%20%3D%20MBS%20AND%20component%20%3D%20%22Web%20service%22%20AND%20resolution%20%3D%20Unresolved%20ORDER%20BY%20priority%20DESC), and if not consider writing one.What else should I know before I start using the API?It'd probably be helpful to know: * [How MusicBrainz is structured](/doc/MusicBrainz_Database/Schema)* What [relationships](https://musicbrainz.org/relationships/) are available
So you're on version 2 of the API then? What happened to version 1?The version 1 of the API was designed with the data structure of the original (pre-2011) version of the MusicBrainz database in mind. It was deprecated in 2011 when we changed to our current data schema, and after running (without further updates) for several years to avoid breaking any tools using it, it was finally taken down in 2019.Do you ever make breaking changes?We try to avoid that, but sometimes we might need to do so. In those cases, they will be announced on [our blog](https://blog.metabrainz.org/category/musicbrainz+breaking-changes/), so consider following that!
All users of the API must ensure that each of their client applications never make more than ONE call per second. Making more than one call per second drives up the load on the servers and prevents others from using the MusicBrainz API. If you impact the server by making more than one call per second, your IP address may be blocked preventing all further access to MusicBrainz. Also, it is important that your application sets a proper User-Agent string in its HTTP request headers. For more details on both of these requirements, please see our [rate limiting page](/doc/MusicBrainz_API/Rate_Limiting). 
The API root URL is `https://musicbrainz.org/ws/2/`. We have 13 resources on our API which represent core [entities](/doc/Entity) in our database: 
```
 area, artist, event, genre, instrument, label, place, recording, release, release-group, series, work, url

```
We also provide an API interface for the following non-core resources: 
```
 rating, tag, collection

```
And we allow you to perform lookups based on other unique identifiers with these resources: 
```
 discid, isrc, iswc

```
On each entity resource, you can perform three different GET requests: 
```
 lookup:   /<ENTITY_TYPE>/<MBID>?inc=<INC>
 browse:   /<RESULT_ENTITY_TYPE>?<BROWSING_ENTITY_TYPE>=<MBID>&limit=<LIMIT>&offset=<OFFSET>&inc=<INC>
 search:   /<ENTITY_TYPE>?query=<QUERY>&limit=<LIMIT>&offset=<OFFSET>

```
... except that browse and search are not implemented for genre entities at this time.  **Note:** Keep in mind only the search request is available without an [MBID](/doc/MusicBrainz_Identifier) (or, in specific cases, a disc ID, ISRC or ISWC). If all you have is the name of an artist or album, for example, you'll need to make a search and pick the right result to get its MBID; only then will you able to use it in a lookup or browse request. On the genre resource, we support an "all" sub-resource to fetch all genres, paginated, in alphabetical order: 
```
 all:      /genre/all?limit=<LIMIT>&offset=<OFFSET>

```
The `/genre/all` resource, in addition to supporting XML and JSON, can output all genre *names* as text by specifying `fmt=txt` or setting the Accept header to `"text/plain"`. The genre names are returned in alphabetical order and separated by newlines. (`limit` and `offset` are not supported for the `txt` format.) Of these first three types of requests: * Lookups, non-MBID lookups and browse requests are documented in following sections, and you can find examples on [the dedicated examples page](/doc/MusicBrainz_API/Examples).* Searches are more complex and are documented on [the search documentation page](/doc/MusicBrainz_API/Search).

The file [musicbrainz\_mmd-2.0.rng](https://github.com/metabrainz/mmd-schema/blob/master/schema/musicbrainz_mmd-2.0.rng) is a Relax NG Schema for the XML version of this API. It can also be used to validate [submissions](#Submitting_data) you're trying to make through it. 
Searches are documented on [the search documentation page](/doc/MusicBrainz_API/Search). 
You can perform a lookup of an entity when you have the MBID for that entity: 
```
 lookup:   /<ENTITY_TYPE>/<MBID>?inc=<INC>

```
Note that unless you have provided an MBID in exactly the format listed, you are not performing a lookup request. If your URL includes something like artist=<MBID>, then please see the [Browse](#Browse) section. If it includes query=<QUERY>, please see the [Search](/doc/MusicBrainz_API/Search) page. 
The inc= parameter allows you to request more information to be included about the entity. Any of the entities directly linked to the entity can be included. 
```
 /ws/2/area
 /ws/2/artist            recordings, releases, release-groups, works
 /ws/2/collection        user-collections (includes private collections, requires authentication)
 /ws/2/event
 /ws/2/genre
 /ws/2/instrument
 /ws/2/label             releases
 /ws/2/place
 /ws/2/recording         artists, releases, release-groups, isrcs, url-rels
 /ws/2/release           artists, collections, labels, recordings, release-groups
 /ws/2/release-group     artists, releases
 /ws/2/series
 /ws/2/work
 /ws/2/url

```
In addition, [Relationships](#Relationships) are available for all entity types except genres via inc parameters. To include more than one subquery in a single request, separate the arguments to `inc=` with a + (plus sign), like `inc=recordings+labels`. All lookups which include release-groups allow a type= argument to filter the release-groups by a specific type. All lookups which include releases also allow the type= argument, and a status= argument is allowed. Note that the number of linked entities returned is always limited to 25. If you need the remaining results, you will have to perform a browse request. Linked entities are always ordered alphabetically by gid.  **Note:** In the XML API, when including `recordings` with a `release` entity, `tracks` listed in `media` have no `title` if that doesn’t differ from recording’s title, to reduce the size of the response. 
Some additional inc= parameters are supported to specify how much of the data about the linked entities should be included: 
```
 - discids           include discids for all media in the releases
 - media             include media for all releases, this includes the # of tracks on each medium and its format.
 - isrcs             include isrcs for all recordings
 - artist-credits    include artists credits for all releases and recordings
 - various-artists   include only those releases where the artist appears on one of the tracks, 
                     but not in the artist credit for the release itself (this is only valid on a
                     /ws/2/artist?inc=releases request).

```

```
 - aliases                   include artist, label, area or work aliases; treat these as a set, as they are not deliberately ordered
 - annotation                include annotation
 - tags, ratings             include tags and/or ratings for the entity
 - user-tags, user-ratings   same as above, but only return the tags and/or ratings submitted by the specified user
 - genres, user-genres       include genres (tags in [the genres list](https://musicbrainz.org/genres)): either all or the ones submitted by the user, respectively

```
Requests with user-tags, user-genres and user-ratings require authentication. You can authenticate using HTTP Digest, use the same username and password used to access the main <https://musicbrainz.org> website. The method to request genres mirrors that of tags: you can use inc=genres to get all the genres everyone has proposed for the entity, or inc=user-genres to get all the genres you have proposed yourself (or both!). For example, to get the genres for the release group for [Nine Inch Nails' Year Zero](https://musicbrainz.org/release-group/3bd76d40-7f0e-36b7-9348-91a33afee20e) you’d want **https://musicbrainz.org/ws/2/release-group/3bd76d40-7f0e-36b7-9348-91a33afee20e?inc=genres+user-genres** for the XML API and **https://musicbrainz.org/ws/2/release-group/3bd76d40-7f0e-36b7-9348-91a33afee20e?inc=genres+user-genres&fmt=json** for the JSON API. Since genres are tags, all the genres are also served with inc=tags with all the other tags. As such, you can always use the tag endpoint if you would rather filter the tags by your own genre list rather than follow the MusicBrainz one, or if you want to also get other non-genre tags (maybe you want moods, or maybe you’re really interested in finding artists who perform hip hop music and [were murdered](https://musicbrainz.org/tag/death%20by%20murder) – we won’t stop you!). 
You can request relationships with the appropriate includes: 
```
 - area-rels
 - artist-rels
 - event-rels
 - genre-rels
 - instrument-rels
 - label-rels
 - place-rels
 - recording-rels
 - release-rels
 - release-group-rels
 - series-rels
 - url-rels
 - work-rels

```
These will load relationships between the requested entity and the specific entity type. For example, if you request "work-rels" when looking up an artist, you'll get all the relationships between this artist and any works, and if you request "artist-rels" you'll get the relationships between this artist and any other artists. As such, keep in mind requesting "artist-rels" for an artist, "release-rels" for a release, etc. **will not** load all the relationships for the entity, just the ones to *other entities of the same type*. In a release request, you might also be interested on relationships for *the recordings linked to the release*, or *the release group linked to the release*, or even for *the works linked to those recordings that are linked to the release* (for example, to find out who played guitar on a specific track, who wrote the lyrics for the song being performed, or whether the release group is part of a series). Similarly, for a recording request, you might want to get the relationships for any linked works. There are three additional includes for this: 
```
 - recording-level-rels
 - release-group-level-rels (for releases only)
 - work-level-rels

```
Keep in mind these just act as switches. If you request *work-level-rels* for a recording, you will still need to request *work-rels* (to get the relationship from the recording to the work in the first place) and any other relationship types you want to see (for example, *artist-rels* if you want to see work-artist relationships). With relationships included, entities will have `<relation-list>` nodes for each target entity type (XML) or a `relations` object containing all relationships (JSON). You can see some examples [the examples page](/doc/MusicBrainz_API/Examples). Any [attributes](https://musicbrainz.org/relationship-attributes) on a relationship will be on `<attribute-list>` nodes (XML) or in the `attributes` array (JSON). Relationship attributes always have a type ID, and some may have an associated value. Those can be found as attributes of the `<attribute>` element (XML) or by using the attribute name as a key for the `attribute-values` and `attribute-ids` elements (JSON). Sometimes the relationship attribute may also have a 'credited-as' name indicated by the user (for example, "guitar" could be credited as "Fender Stratocaster" or "violin" as "1st violin"). In an XML response this is yet another attribute on the XML `<attribute>` element element, while on a JSON response you'll need to look at the `attribute-credits` element. Note that requesting "genre-rels" does not indicate the genres for a specific entity. For that, use "genres". 
Instead of MBIDs, you can also perform lookups using several other unique identifiers. However, because clashes sometimes occur, each of these lookups return a list of entities (there is no limit, all linked entities will be returned, paging is not supported). 
```
 lookup: /discid/<discid>?inc=<INC>&toc=<TOC>

```
A `discid` lookup returns a list of associated releases, the 'inc=' arguments supported are identical to a lookup request for a release. If there are no matching releases in MusicBrainz, but a matching [CD stub](/doc/CD_Stub) exists, it will be returned. This is the default behaviour. If you do *not* want to see CD stubs, pass 'cdstubs=no.' CD stubs are contained within a <cdstub> element, and otherwise have the same form as a release. Note that CD stubs do not have artist credits, just artists. If you provide the "toc" query parameter, and if the provided disc ID is not known by MusicBrainz, a fuzzy lookup will done to find matching MusicBrainz releases. Note that if CD stubs are found this will not happen. If you do want TOC fuzzy lookup, but not CD stub searching, specify "cdstubs=no". For example: 
```
  /ws/2/discid/I5l9cCSFccLKFEKS.7wqSZAorPU-?toc=1+12+267257+150+22767+41887+58317+72102+91375+104652+115380+132165+143932+159870+174597

```
Will look for the disc id first, and if it fails, will try to find tracklists that are within a similar distance to the one provided. It's also possible to perform a fuzzy TOC search without a discid. Passing "-" (or any invalid placeholder) as the discid will cause it to be ignored if a valid TOC is present: 
```
  /ws/2/discid/-?toc=1+12+267257+150+22767+41887+58317+72102+91375+104652+115380+132165+143932+159870+174597

```
By default, fuzzy TOC searches only return mediums whose format is set to "CD." If you want to search all mediums regardless of format, add 'media-format=all' to the query: 
```
  /ws/2/discid/-?toc=1+12+267257+150+22767+41887+58317+72102+91375+104652+115380+132165+143932+159870+174597&media-format=all

```
The TOC consists of the following: * First track (always 1)* total number of tracks* sector offset of the leadout (end of the disc)* a list of sector offsets for each track, beginning with track 1 (generally 150 sectors)

```
 lookup: /isrc/<isrc>?inc=<INC>

```
An `isrc` lookup returns a list of recordings, the 'inc=' arguments supported are identical to a lookup request for a recording. 
```
 lookup: /iswc/<iswc>?inc=<INC>

```
An `iswc` lookup returns a list of works, the 'inc=' arguments supported are identical to a lookup request for a work. 
```
 lookup: /ws/2/url?resource=<URL>[&resource=<URL>]...

```
The URL endpoint's 'resource' parameter is for providing a URL directly, rather than a URL MBID (for example, <https://musicbrainz.org/ws/2/url?resource=http://www.madonna.com/> versus <https://musicbrainz.org/ws/2/url/b663423b-9b54-4067-9674-fffaecf68851>). This URL will need to be appropriately URL-escaped for inclusion as a query parameter; this means that URLs that include url-escaped parameters, or query parameters of their own, will need to be escaped a second time. If the requested 'resource' does not exist, this endpoint will return 404 not found. The 'resource' parameter can be specified multiple times (up to 100) in a single query: 
```
 /ws/2/url?resource=http://www.madonna.com/&resource=https://www.ladygaga.com/

```
The response will contain a url-list in this case, rather than a single top-level url, and any 'resource' that is not found will be skipped. 
Browse requests are a direct lookup of all the entities directly linked to another entity ("directly linked" here meaning it does not include entities linked by a relationship). For example, you may want to see all releases on the label ubiktune: 
```
 /ws/2/release?label=47e718e1-7ee4-460c-b1cc-1192a841c6e5

```
Note that browse requests are not searches: in order to browse all the releases on the ubiktune label you will need to know the MBID of ubiktune. The order of the results depends on what linked entity you are browsing by (however it will always be consistent). If you need to sort the entities, you will have to fetch all entities (see "Paging" below) and sort them yourself. 
The following list shows which linked entities you can use in a browse request: 
```
 /ws/2/area              collection
 /ws/2/artist            area, collection, recording, release, release-group, work
 /ws/2/collection        area, artist, editor, event, label, place, recording, release, release-group, work
 /ws/2/event             area, artist, collection, place
 /ws/2/genre             collection
 /ws/2/instrument        collection
 /ws/2/label             area, collection, release
 /ws/2/place             area, collection
 /ws/2/recording         artist, collection, release, work
 /ws/2/release           area, artist, collection, label, track, track_artist, recording, release-group
 /ws/2/release-group     artist, collection, release
 /ws/2/series            collection
 /ws/2/work              artist, collection

```
As a special case, release also allows track\_artist, which is intended to allow you to browse various artist appearances for an artist. It will return any release where the artist appears in the artist credit for a track, but NOT in the artist credit for the entire release (as those would already have been returned in a request with artist=<MBID>). Release-groups can be filtered on type, and releases can be filtered on type and/or status. For example, if you want all the live bootleg releases by Metallica: 
```
 /ws/2/release?artist=65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab&status=bootleg&type=live

```
Or all albums and EPs by Autechre: 
```
 /ws/2/release-group?artist=410c9baf-5469-44f6-9852-826524b80c61&type=album|ep

```

Browse requests are the only requests which support paging: any browse request supports an 'offset=' argument to get more results. Browse requests also support 'limit=': the default limit is 25, and you can increase that up to 100. **Special note for releases**: To ensure requests can complete without timing out, we limit the number of releases returned such that the entire list contains no more than 500 tracks. (However, at least one full release is always returned, even if it has more than 500 tracks; we don't return "partial" releases.) This means that you may not get 100 releases per page if you set `limit=100`; in fact the number will vary per page depending on the size of the releases. In order to page through the results properly, increment `offset` by the number of releases you get from each response, rather than the (larger, fixed) `limit` size. 
Just like with normal lookup requests, the server can be instructed to include more data about the entity using an 'inc=' argument. Supported values for inc= are: 
```
 /ws/2/area              aliases
 /ws/2/artist            aliases
 /ws/2/event             aliases
 /ws/2/instrument        aliases
 /ws/2/label             aliases
 /ws/2/place             aliases
 /ws/2/recording         artist-credits, isrcs
 /ws/2/release           artist-credits, labels, recordings, release-groups, media, discids, isrcs (with recordings)
 /ws/2/release-group     artist-credits
 /ws/2/series            aliases
 /ws/2/work              aliases
 /ws/2/area              aliases
 /ws/2/url               (only relationship includes)

```
In addition to the inc= values listed above, all entities support: 
```
 annotation, tags, user-tags, genres, user-genres

```
All entities except area, place, release, and series support: 
```
 ratings, user-ratings

```
In addition, [Relationships](#Relationships) are available for all entity types via inc parameters, as with lookup requests. 
Any query which includes release groups in the results can be filtered to only include release groups of a certain type. Any query which includes releases in the results can be filtered to only include releases of a certain type and/or status. Valid values are: 
```
 status     official, promotion, bootleg, pseudo-release, withdrawn, cancelled.
 type       album, single, ep, broadcast, other (primary types) / audio drama, audiobook, compilation, demo, dj-mix, field recording, interview, live, mixtape/street, remix, soundtrack, spokenword (secondary types).

```
See [the release status documentation](/doc/Release#Status) and [the release group type documentation](/doc/Release_Group/Type) for info on what these values mean. Additionally, browsing release groups via artist supports a special filter to show the same release groups as in the default website overview (excluding ones that contain only releases of status promotional, bootleg or pseudo-release). Valid values are: 
```
 release-group-status     website-default, all

```

You can use the API to submit certain kinds of data. Currently tags (including genres), ratings and ISRCs can be entered through the API. 
All POST requests require authentication. You should authenticate using HTTP Digest, using the same username and password you use to access the main <https://musicbrainz.org> website. The realm is "musicbrainz.org". POST requests should always include a 'client' parameter in the URL (not the body). The value of 'client' should be the ID of the client software submitting data. This has to be the application's name and version number, not that of a client library (client libraries should use HTTP's User-Agent header). The recommended format is "application-version", where version does not contain a - character. 
You can submit tags (including genres) and ratings through the **XML** API using POST requests. As described above, the client software needs to identify itself using the 'client=' parameter. In the following examples I will use 'example.app-0.4.7' as the client identifier; this is obviously a fictitious client. 
To submit tags (including genres), perform a POST request to the /ws/2/tag url, like this: 
```
  /ws/2/tag?client=example.app-0.4.7

```
The body of your request should be an XML formatted list of entities with <user-tag> elements. An example request is reproduced below: 
```
<metadata xmlns="http://musicbrainz.org/ns/mmd-2.0#">
    <artist-list>
        <artist id="a16d1433-ba89-4f72-a47b-a370add0bb56">
            <user-tag-list>
                <user-tag><name>female</name></user-tag>
                <user-tag><name>korean</name></user-tag>
                <user-tag><name>jpop</name></user-tag>
            </user-tag-list>
        </artist>
    </artist-list>
    <recording-list>
        <recording id="047ea202-b98d-46ae-97f7-0180a20ee5cf">
            <user-tag-list>
                <user-tag><name>noise</name></user-tag>
            </user-tag-list>
        </recording>
    </recording-list>
</metadata>

```
Because you're sending XML in the body of your POST request, make sure to also set the Content-Type to "application/xml; charset=utf-8". Our tag functionality includes the ability to upvote and downvote tags (including genres). This terminology can be confusing. Whenever you tag something, you are in fact "upvoting" it (which will add 1 to the vote count for the tag). Downvoting is the inverse operation, and will subtract 1 from the tag's vote count. Tags that you downvote will be hidden from the UI for you (and if their total vote count drops to 0 or below, they'll be hidden for everyone). The "user-tag" elements can include a "vote" attribute that specifies what action you want to take: 
```
<user-tag vote="upvote"><name>noise</name></user-tag>
<user-tag vote="downvote"><name>pop</name></user-tag>
<user-tag vote="withdraw"><name>rock</name></user-tag>

```
The "withdraw" vote will remove any upvote or downvote that you previously added (as if you had never voted). If you do not supply any "vote" attributes in your request (as in the example above), then the list of tags you submit will be treated as upvotes and will completely replace all existing upvoted tags you have on that entity. (So, tags that are not included in the request will be withdrawn, if they were previously upvoted. Downvoted tags are left in place.) This is a legacy behavior that we maintain from before we had tag voting. Including any "vote" attribute in the request will cause it to only apply those votes that you specified. 
To submit ratings, perform a POST request to the /ws/2/rating url, like this: 
```
  /ws/2/rating?client=example.app-0.4.7

```
The body of your request should be an XML formatted list of entities with <user-rating> elements. An example request is reproduced below: 
```
<metadata xmlns="http://musicbrainz.org/ns/mmd-2.0#">
    <artist-list>
        <artist id="455641ea-fff4-49f6-8fb4-49f961d8f1ad">
            <user-rating>100</user-rating>
        </artist>
    </artist-list>
    <recording-list>
        <recording id="c410a773-c6eb-4bc0-9df8-042fe6645c63">
            <user-rating>20</user-rating>
        </recording>
    </recording-list>
</metadata>

```

To add or remove releases (for example) from your collection, perform a PUT or DELETE request to /ws/2/collection/<gid>/releases, respectively: 
```
   PUT /ws/2/collection/f4784850-3844-11e0-9e42-0800200c9a66/releases/455641ea-fff4-49f6-8fb4-49f961d8f1ad;c410a773-c6eb-4bc0-9df8-042fe6645c63?client=example.app-0.4.7
   DELETE /ws/2/collection/f4784850-3844-11e0-9e42-0800200c9a66/releases/455641ea-fff4-49f6-8fb4-49f961d8f1ad;?client=example.app-0.4.7

```
Other types of entities supported by collections can be submitted, too; just substitute "releases" in the URI with one of: areas, artists, events, labels, places, recordings, release-groups, or works, depending on the type of collection. You may submit up to ~400 entities in a single request, separated by a semicolon (;), as the PUT example above shows. You are restricted to a maximum URI length of 16kb at the moment (which roughly equates to 400 gids). To get the description of a collection, perform a lookup request with the collection MBID: 
```
   GET /ws/2/collection/4a0a2cd0-3b20-4093-bd99-92788045845e

```
To get the description and the summarized contents of a collection, perform a lookup request with the collection MBID and the appropriate entity subquery: 
```
   GET /ws/2/collection/4a0a2cd0-3b20-4093-bd99-92788045845e/areas
   GET /ws/2/collection/f4784850-3844-11e0-9e42-0800200c9a66/releases
   ...

```
To get the contents of a collection, perform a browse request on the appropriate entity endpoint, using the collection MBID as a parameter: 
```
   GET /ws/2/area?collection=4a0a2cd0-3b20-4093-bd99-92788045845e
   GET /ws/2/release?collection=f4784850-3844-11e0-9e42-0800200c9a66
   ...

```
To get a list of collections for a given user (including the number of entities in each collection), you can browse the collection endpoint by editor name: 
```
   GET /ws/2/collection?editor=rob

```
This will only return collections that rob has made public. If you wish to see private collections as an authenticated user, do: 
```
   GET /ws/2/collection?editor=rob&inc=user-collections

```

Barcodes may be associated with releases by issuing an XML POST request to: 
```
   /ws/2/release/?client=example.app-0.4.7

```
The body of the request must be an XML document with a list of <releases>s in a <release-list>, and a single barcode in a <barcode> element for each release. For example: 
```
<metadata xmlns="http://musicbrainz.org/ns/mmd-2.0#">
    <release-list>
        <release id="047ea202-b98d-46ae-97f7-0180a20ee5cf">
            <barcode>4050538793819</barcode>
        </release>
    </release-list>
</metadata>

```
Only GTIN (EAN/UPC) codes are accepted. Codes that have an incorrect check sum or a 2/5-digit add-on are refused. These should be manually added as annotation through the release editor instead. Upon issuing this request MusicBrainz will create a single edit in the edit queue for applying these changes. These changes will *not* be automatically applied, though they will be applied if either no one votes against your changes, or once your changes expire. 
ISRCs may be associated with recordings by issuing an XML POST request to: 
```
   /ws/2/recording/?client=example.app-0.4.7

```
The body of the request must be an XML document with a list of <recording>s in a <recording-list>, and a list of <ISRC>s in a <isrc-list> to be associated with the recordings. For example: 
```
<metadata xmlns="http://musicbrainz.org/ns/mmd-2.0#">
  <recording-list>
    <recording id="b9991644-7275-44db-bc43-fff6c6b4ce69">
      <isrc-list count="1">
        <isrc id="JPB600601201" />
      </isrc-list>
    </recording>
    <recording id="75c961c9-6e00-4861-9c9d-e6ca90d57342">
      <isrc-list count="1">
        <isrc id="JPB600523201" />
      </isrc-list>
    </recording>
  </recording-list>
</metadata>

```

It can be accessed with our C/C++ library, [libmusicbrainz](/doc/libmusicbrainz). **Third party libraries:*** C#/Mono/.NET:
	+ [avatar29A/MusicBrainz](https://github.com/avatar29A/MusicBrainz)+ [MetaBrainz.MusicBrainz](https://github.com/Zastai/MetaBrainz.MusicBrainz) ([NuGet Package](https://www.nuget.org/packages/MetaBrainz.MusicBrainz))* Common Lisp - [cl-musicbrainz](https://github.com/0/cl-musicbrainz)* Go
	+ [github.com/michiwend/gomusicbrainz](https://github.com/michiwend/gomusicbrainz)+ [go.uploadedlobster.com/musicbrainzws2](https://git.sr.ht/~phw/go-musicbrainzws2)* Haskell:
	+ [ClintAdams/MusicBrainz](http://hackage.haskell.org/package/MusicBrainz)+ [ocharles/musicbrainz-data](https://github.com/ocharles/haskell-musicbrainz-ws2)* Java - [musicbrainzws2-java](http://code.google.com/p/musicbrainzws2-java/)* JavaScript/Node.js:
	+ [musicbrainz-api](https://github.com/Borewit/musicbrainz-api)+ [node-musicbrainz](https://github.com/maxkueng/node-musicbrainz)* Objective-C - [libmusicbrainz-objc](https://github.com/demosdemon/libmusicbrainz-objc)* Perl - [WebService::MusicBrainz](https://metacpan.org/pod/WebService::MusicBrainz)* PHP:
	+ [lachlan-00/MusicBrainz](https://github.com/lachlan-00/MusicBrainz), a fork of [mikealmond/MusicBrainz](https://github.com/mikealmond/MusicBrainz)+ [mikealmond/MusicBrainz](https://github.com/mikealmond/MusicBrainz), a fork of [phpbrainz](/doc/phpbrainz)+ [PBXg33k/MusicBrainz](https://github.com/PBXg33k/MusicBrainz)+ [stephan-strate/php-music-brainz-api](https://github.com/stephan-strate/php-music-brainz-api)* Python - [python-musicbrainzngs](http://python-musicbrainzngs.readthedocs.org/)* Ruby:
	+ [dwo/musicbrainz-ruby](https://github.com/dwo/musicbrainz-ruby)+ [magnolia-fan/musicbrainz](https://github.com/magnolia-fan/musicbrainz)* Rust - musicbrainz\_rs: [Crate](https://crates.io/crates/musicbrainz_rs) ([GitHub](https://github.com/oknozor/musicbrainz_rs))

This page is [transcluded](/doc/WikiDocs) from revision [#78309](////wiki.musicbrainz.org/MusicBrainz_API?oldid=78309) of [MusicBrainz API](//wiki.musicbrainz.org/MusicBrainz_API).[Donate](https://metabrainz.org/donate)[Wiki](//wiki.musicbrainz.org/)[Forums](https://community.metabrainz.org/)[Chat](/doc/Communication/ChatBrainz)[Bug tracker](http://tickets.metabrainz.org/)[Blog](https://blog.metabrainz.org/)[Mastodon](https://mastodon.social/@MusicBrainz)[Bluesky](https://bsky.app/profile/musicbrainz.org)[Use beta site](/set-beta-preference?returnto=%2Fdoc%2FMusicBrainz_API)

Brought to you by [MetaBrainz Foundation](https://metabrainz.org/) and our [sponsors](https://metabrainz.org/sponsors) and [supporters](https://metabrainz.org/supporters).

---

# MusicBrainz - the open music encyclopedia

MusicBrainz - the open music encyclopedia[](/ "MusicBrainz") ArtistEventRecordingReleaseRelease groupSeriesWorkAreaInstrumentLabelPlaceAnnotationTagCD stubEditorDocumentation MusicBrainz is an open music encyclopedia that collects music metadata and makes it available to the public.

MusicBrainz aims to be:

1. **The ultimate source of music information** by allowing anyone to contribute and releasing the [data](/doc/MusicBrainz_Database) under [open licenses](/doc/About/Data_License).
2. **The universal lingua franca for music** by providing a reliable and unambiguous form of [music identification](/doc/MusicBrainz_Identifier), enabling both people and machines to have meaningful conversations about music.

Like Wikipedia, MusicBrainz is maintained by a global community of users and we want everyone — including you — to [participate and contribute](/doc/How_to_Contribute).

[More Information](/doc/About) — [FAQs](/doc/Frequently_Asked_Questions) — [Contact Us](https://metabrainz.org/contact)MusicBrainz is operated by the [MetaBrainz Foundation](https://metabrainz.org), a California based 501(c)(3) tax-exempt non-profit corporation dedicated to keeping MusicBrainz [free and open source](/doc/About/Data_License).

**Latest posts:**

* [Rest in Peace drsaunde!](https://blog.metabrainz.org/2025/04/22/rest-in-peace-drsaunde/)
* [Updates to Audiobooks, Audio Dramas, Broadcasts and Podcasts](https://blog.metabrainz.org/2025/04/17/updates-to-audiobooks-audio-dramas-broadcasts-and-podcasts/)
* [MusicBrainz Server update, 2025-04-14](https://blog.metabrainz.org/2025/04/14/musicbrainz-server-update-2025-04-14/)
* [MusicBrainz Server update, 2025-03-24](https://blog.metabrainz.org/2025/03/24/musicbrainz-server-update-2025-03-24/)
* [Schema change release: May 19, 2025](https://blog.metabrainz.org/2025/03/18/schema-change-release-may-19-2025/)
* [Google Summer of Code 2025: MetaBrainz has been accepted!](https://blog.metabrainz.org/2025/02/28/google-summer-of-code-2025-metabrainz-has-been-accepted/)

**[Read more »](http://blog.metabrainz.org)**

* [MusicBrainz Picard](//picard.musicbrainz.org)
* [AudioRanger](/doc/AudioRanger)
* [Mp3tag](/doc/Mp3tag)
* [Yate Music Tagger](/doc/Yate_Music_Tagger)

* [Beginners guide](/doc/Beginners_Guide)
* [Editing introduction](/doc/How_Editing_Works)
* [Style guidelines](/doc/Style)
* [FAQs](/doc/Frequently_Asked_Questions)
* [How to add artists](/doc/How_to_Add_an_Artist)
* [How to add releases](/doc/How_to_Add_a_Release)

* [How to contribute](/doc/How_to_Contribute)
* [Bug tracker](https://tickets.metabrainz.org/)
* [Forums](https://community.metabrainz.org/)

[The majority of the data in the **MusicBrainz Database** is released into the **Public Domain** and can be downloaded and used **for free**.](/doc/MusicBrainz_Database)

[Use our **XML web service** or **development libraries** to create your own MusicBrainz-enabled applications.](/doc/Developer_Resources)

[](/release/5641c7b4-8442-4ea0-a89a-d37dec83d9f8 "remind by BluJayMix")[](/release/ecc3c9c8-5ebf-4ffa-bfdd-9cc933bb887c "glosscore morning by Lil Wet Wet")[](/release/3274dad9-7377-4811-8a3c-aec1c460362b "La Loba (Remixes) by La Chica")[](/release/a3cd75ab-16d4-4589-a5c2-a28815fde73c "Push the Button by Teapacks")[](/release/40200ec3-6713-42fa-ab11-7ef5b1a2f3bf "glosscore morning by lil wet wet")[](/release/2fac095d-5c99-43ea-8ddc-cb915bc1a0e3 "This Just In! by thegoodnews.")[](/release/61f3edb5-9c4a-4dc6-933d-f41ab2910dfb "10 años de canción tradicional (en directo) by Nuevo Mester de Juglaría")[](/release/696bb3ba-7bbf-476e-b6e9-d121eb57bc5f "Opera For Orchestra by Wolfgang Amadeus Mozart, Paul Freeman & National Opera Orchestra")[](/release/1eb9886c-5072-47ec-92b3-534808036c54 "Generation of the Void by Nailed to Obscurity")[](/release/44f7d8c3-c68e-4cd1-a66c-96272c30d2e5 "rest by Lil Wet Wet feat. Rocco Bunko")
[](/event/1548b7ac-36db-4866-98a8-9fbf170284ae "GOOSE (try-out) at Bootstraat")[](/event/3f489137-b5ef-4510-b87f-c9649069d1b7 "kunstennacht 2025: Mouttoren")[](/event/0e7ca0ed-5e38-472c-9f48-3e3c0a9d28f0 "Kunstennacht 2025: Cambrinus")[](/event/c433399f-9c59-4c8e-9cf0-5824dde299f7 "Kunstennacht 2025: Japanse Tuin")[](/event/05b54050-df63-433c-9fcd-cf46a3909f07 "Elements Festival 2023")[](/event/358f610c-c047-4010-b4f7-8d6e750fe95b "Max Styler")[](/event/aa074ce2-644e-4202-a7ec-750f812340ac "Les Sables Électroniques 2024")[](/event/78029f29-1c70-4631-a75a-e34a4a8f381e "Les Sables Électroniques 2023")[](/event/c45373df-19ac-4b3a-b6dc-5d0e8af38441 "Live At Leeds 2025")[](/event/d6ed6361-1e67-4db8-a410-58b00592e71d "TOHO - 東方良音 -")[Donate](https://metabrainz.org/donate)[Wiki](//wiki.musicbrainz.org/)[Forums](https://community.metabrainz.org/)[Chat](/doc/Communication/ChatBrainz)[Bug tracker](http://tickets.metabrainz.org/)[Blog](https://blog.metabrainz.org/)[Mastodon](https://mastodon.social/@MusicBrainz)[Bluesky](https://bsky.app/profile/musicbrainz.org)[Use beta site](/set-beta-preference?returnto=%2F)

Brought to you by [MetaBrainz Foundation](https://metabrainz.org/) and our [sponsors](https://metabrainz.org/sponsors) and [supporters](https://metabrainz.org/supporters).

---

# Installation — musicbrainzngs 0.7.1 documentation

Installation — musicbrainzngs 0.7.1 documentation

* [index](../genindex/ "General Index")
* [modules](../py-modindex/ "Python Module Index") |
* [next](../usage/ "Usage") |
* [previous](../ "musicbrainzngs 0.7.1") |
* [musicbrainzngs 0.7.1 documentation](../) »

If you want the latest stable version of musicbrainzngs, the first place to
check is your systems package manager. Being a relatively new library, you
might not be able to find it packaged by your distribution and need to use one
of the alternate installation methods.

Musicbrainzngs is available on the Python Package Index. This makes installing
it with [pip](http://www.pip-installer.org) as easy as:

```
pip install musicbrainzngs

```

If you want the latest code or even feel like contributing, the code is
available on [GitHub](https://github.com/alastair/python-musicbrainzngs).

You can easily clone the code with git:

```
git clone git://github.com/alastair/python-musicbrainzngs.git

```

Now you can start hacking on the code or install it system-wide:

```
python setup.py install

```

* [Installation](#)
	+ [Package manager](#package-manager)
	+ [PyPI](#pypi)
	+ [Git](#git)

[musicbrainzngs 0.7.1](../ "previous chapter")

[Usage](../usage/ "next chapter")

* [index](../genindex/ "General Index")
* [modules](../py-modindex/ "Python Module Index") |
* [next](../usage/ "Usage") |
* [previous](../ "musicbrainzngs 0.7.1") |
* [musicbrainzngs 0.7.1 documentation](../) »

 © Copyright 2012, Alastair Porter et al.
 Last updated on Jan 11, 2020.
 Created using [Sphinx](http://sphinx-doc.org/) 1.8.5.

---

# Usage — musicbrainzngs 0.7.1 documentation

Usage — musicbrainzngs 0.7.1 documentation

* [index](../genindex/ "General Index")
* [modules](../py-modindex/ "Python Module Index") |
* [next](../api/ "API") |
* [previous](../installation/ "Installation") |
* [musicbrainzngs 0.7.1 documentation](../) »

In general you need to set a useragent for your application,
start searches to get to know corresponding MusicBrainz IDs
and then retrieve information about these entities.

The data is returned in form of a [`dict`](https://python.readthedocs.io/en/v2.7.2/library/stdtypes.html#dict "(in Python v2.7)").

If you also want to submit data,
then you must authenticate as a MusicBrainz user.

This part of the documentation will give you usage examples.
For an overview of available functions you can have a look at
the [API](../api/).

To access the MusicBrainz webservice through this library, you [need to
identify your application](http://musicbrainz.org/doc/XML_Web_Service/Version_2#Identifying_your_application_to_the_MusicBrainz_Web_Service)
by setting the useragent header made in HTTP requests to one that is unique to
your application.

To ease this, the convenience function [`musicbrainzngs.set\_useragent()`](../api/#musicbrainzngs.set_useragent "musicbrainzngs.set_useragent") is
provided which automatically sets the useragent based on information about the
application name, version and contact information to the format [recommended by
MusicBrainz](http://musicbrainz.org/doc/XML_Web_Service/Rate_Limiting#Provide_meaningful_User-Agent_strings).

If a request is made without setting the useragent beforehand, a
[`musicbrainzngs.UsageError`](../api/#musicbrainzngs.UsageError "musicbrainzngs.UsageError") will be raised.

Certain calls to the webservice require user authentication prior to the call
itself. The affected functions state this requirement in their documentation.
The user and password used for authentication are the same as for the
MusicBrainz website itself and can be set with the [`musicbrainzngs.auth()`](../api/#musicbrainzngs.auth "musicbrainzngs.auth")
method. After calling this function, the credentials will be saved and
automaticall used by all functions requiring them.

If a method requiring authentication is called without authenticating, a
[`musicbrainzngs.UsageError`](../api/#musicbrainzngs.UsageError "musicbrainzngs.UsageError") will be raised.

If the credentials provided are wrong and the server returns a status code of
401, a [`musicbrainzngs.AuthenticationError`](../api/#musicbrainzngs.AuthenticationError "musicbrainzngs.AuthenticationError") will be raised.

You can get MusicBrainz entities as a [`dict`](https://python.readthedocs.io/en/v2.7.2/library/stdtypes.html#dict "(in Python v2.7)")
when retrieving them with some form of identifier.
An example using [`musicbrainzngs.get\_artist\_by\_id()`](../api/#musicbrainzngs.get_artist_by_id "musicbrainzngs.get_artist_by_id"):

```
artist\_id = "c5c2ea1c-4bde-4f4d-bd0b-47b200bf99d6"
try:
    result = musicbrainzngs.get\_artist\_by\_id(artist\_id)
except WebServiceError as exc:
    print("Something went wrong with the request: %s" % exc)
else:
    artist = result["artist"]
    print("name:\t\t%s" % artist["name"])
    print("sort name:\t%s" % artist["sort-name"])

```

You can get more information about entities connected to the artist
with adding includes and you filter releases and release\_groups:

```
result = musicbrainzngs.get\_artist\_by\_id(artist\_id,
              includes=["release-groups"], release\_type=["album", "ep"])
for release\_group in result["artist"]["release-group-list"]:
    print("{title} ({type})".format(title=release\_group["title"],
                                    type=release\_group["type"]))

```

Tip

Compilations are also of primary type âalbumâ.
You have to filter these out manually if you donât want them.

Note

You can only get at most 25 release groups using this method.
If you want to fetch all release groups you will have to
[browse](browsing).

This library includes a few methods to access data from the [Cover Art Archive](https://coverartarchive.org/) which has a [documented API](https://musicbrainz.org/doc/Cover_Art_Archive/API).

Both [`musicbrainzngs.get\_image\_list()`](../api/#musicbrainzngs.get_image_list "musicbrainzngs.get_image_list") and
[`musicbrainzngs.get\_release\_group\_image\_list()`](../api/#musicbrainzngs.get_release_group_image_list "musicbrainzngs.get_release_group_image_list") return the deserialized
cover art listing for a [release](https://musicbrainz.org/doc/Cover_Art_Archive/API#.2Frelease.2F.7Bmbid.7D.2F)
or [release group](https://musicbrainz.org/doc/Cover_Art_Archive/API#.2Frelease-group.2F.7Bmbid.7D.2F).
To find out whether a release
has an approved front image, you could use the following example code:

```
release\_id = "46a48e90-819b-4bed-81fa-5ca8aa33fbf3"
data = musicbrainzngs.get\_cover\_art\_list("46a48e90-819b-4bed-81fa-5ca8aa33fbf3")
for image in data["images"]:
    if "Front" in image["types"] and image["approved"]:
        print "%s is an approved front image!" % image["thumbnails"]["large"]
        break

```

To retrieve an image itself, use [`musicbrainzngs.get\_image()`](../api/#musicbrainzngs.get_image "musicbrainzngs.get_image"). A
few convenience functions like [`musicbrainzngs.get\_image\_front()`](../api/#musicbrainzngs.get_image_front "musicbrainzngs.get_image_front")
are provided to allow easy access to often requested images.

Warning

There is no upper bound for the size of images uploaded to the
Cover Art Archive and downloading an image will return the binary data in
memory. Consider using the [`tempfile`](https://python.readthedocs.io/en/v2.7.2/library/tempfile.html#module-tempfile "(in Python v2.7)") module or similar
techniques to save images to disk as soon as possible.

When you donât know the MusicBrainz IDs yet, you have to start a search.
Using [`musicbrainzngs.search\_artists()`](../api/#musicbrainzngs.search_artists "musicbrainzngs.search_artists"):

```
result = musicbrainzngs.search\_artists(artist="xx", type="group",
                                       country="GB")
for artist in result['artist-list']:
    print(u"{id}: {name}".format(id=artist['id'], name=artist["name"]))

```

Tip

Musicbrainzngs returns unicode strings.
Itâs up to you to make sure Python (2) doesnât try to convert these
to ascii again. In the example we force a unicode literal for print.
Python 3 works without fixes like these.

You can also use the query without specifying the search fields:

```
musicbrainzngs.search\_release\_groups("the clash london calling")

```

The query and the search fields can also be used at the same time.

When you want to fetch a list of entities greater than 25,
you have to use one of the browse functions.
Not only can you specify a limit as high as 100,
but you can also specify an offset to get the complete list
in multiple requests.

An example would be using [`musicbrainzngs.browse\_release\_groups()`](../api/#musicbrainzngs.browse_release_groups "musicbrainzngs.browse_release_groups")
to get all releases for a label:

```
label = "71247f6b-fd24-4a56-89a2-23512f006f0c"
limit = 100
offset = 0
releases = []
page = 1
print("fetching page number %d.." % page)
result = musicbrainzngs.browse\_releases(label=label, includes=["labels"],
                release\_type=["album"], limit=limit)
page\_releases = result['release-list']
releases += page\_releases
# release-count is only available starting with musicbrainzngs 0.5
if "release-count" in result:
        count = result['release-count']
        print("")
while len(page\_releases) >= limit:
    offset += limit
    page += 1
    print("fetching page number %d.." % page)
    result = musicbrainzngs.browse\_releases(label=label, includes=["labels"],
                        release\_type=["album"], limit=limit, offset=offset)
    page\_releases = result['release-list']
    releases += page\_releases
print("")
for release in releases:
    for label\_info in release['label-info-list']:
        catnum = label\_info.get('catalog-number')
        if label\_info['label']['id'] == label and catnum:
            print("{catnum:>17}: {date:10} {title}".format(catnum=catnum,
                        date=release['date'], title=release['title']))
print("\n%d releases on %d pages" % (len(releases), page))

```

Tip

You should always try to filter in the query, when possible,
rather than fetching everything and filtering afterwards.
This will make your application faster
since web service requests are throttled.
In the example we filter by release\_type.

You can also submit data using musicbrainzngs.
Please use [`musicbrainzngs.set\_hostname()`](../api/#musicbrainzngs.set_hostname "musicbrainzngs.set_hostname") to set the host to
test.musicbrainz.org when testing the submission part of your application.

[Authentication](#authentication) is necessary to submit any data to MusicBrainz.

An example using [`musicbrainzngs.submit\_barcodes()`](../api/#musicbrainzngs.submit_barcodes "musicbrainzngs.submit_barcodes") looks like this:

```
musicbrainzngs.set\_hostname("test.musicbrainz.org")
musicbrainzngs.auth("test", "mb")

barcodes = {
    "174a5513-73d1-3c9d-a316-3c1c179e35f8": "5099749534728",
    "838952af-600d-3f51-84d5-941d15880400": "602517737280"
}
musicbrainzngs.submit\_barcodes(barcodes)

```

See [Submitting](../api/#api-submitting) in the API for other possibilites.

You can find some examples for using musicbrainzngs in the
[examples directory](https://github.com/alastair/python-musicbrainzngs/tree/master/examples).

* [Usage](#)
	+ [Identification](#identification)
	+ [Authentication](#authentication)
	+ [Getting Data](#getting-data)
		- [Regular MusicBrainz Data](#regular-musicbrainz-data)
		- [Cover Art Data](#cover-art-data)
	+ [Searching](#searching)
	+ [Browsing](#browsing)
	+ [Submitting](#submitting)
	+ [More Examples](#more-examples)

[Installation](../installation/ "previous chapter")

[API](../api/ "next chapter")

* [index](../genindex/ "General Index")
* [modules](../py-modindex/ "Python Module Index") |
* [next](../api/ "API") |
* [previous](../installation/ "Installation") |
* [musicbrainzngs 0.7.1 documentation](../) »

 © Copyright 2012, Alastair Porter et al.
 Last updated on Jan 11, 2020.
 Created using [Sphinx](http://sphinx-doc.org/) 1.8.5.

---

# API — musicbrainzngs 0.7.1 documentation

API — musicbrainzngs 0.7.1 documentation

* [index](../genindex/ "General Index")
* [modules](../py-modindex/ "Python Module Index") |
* [previous](../usage/ "Usage") |
* [musicbrainzngs 0.7.1 documentation](../) »

This is a shallow python binding of the MusicBrainz web service
so you should read
[Development/XML Web Service/Version 2](https://musicbrainz.org/doc/Development/XML Web Service/Version 2)
to understand how that web service works in general.

All requests that fetch data return the data in the form of a [`dict`](https://python.readthedocs.io/en/v2.7.2/library/stdtypes.html#dict "(in Python v2.7)").
Attributes and elements both map to keys in the dict.
List entities are of type [`list`](https://python.readthedocs.io/en/latest/library/stdtypes.html#list "(in Python v3.7)").

This part will give an overview of available functions.
Have a look at [Usage](../usage/) for examples on how to use them.

`musicbrainzngs.``auth`(*u*, *p*)[Â¶](#musicbrainzngs.auth "Permalink to this definition")
Set the username and password to be used in subsequent queries to
the MusicBrainz XML API that require authentication.

`musicbrainzngs.``set_rate_limit`(*limit\_or\_interval=1.0*, *new\_requests=1*)[Â¶](#musicbrainzngs.set_rate_limit "Permalink to this definition")
Sets the rate limiting behavior of the module. Must be invoked
before the first Web service call.
If the limit\_or\_interval parameter is set to False then
rate limiting will be disabled. If it is a number then only
a set number of requests (new\_requests) will be made per
given interval (limit\_or\_interval).

`musicbrainzngs.``set_useragent`(*app*, *version*, *contact=None*)[Â¶](#musicbrainzngs.set_useragent "Permalink to this definition")
Set the User-Agent to be used for requests to the MusicBrainz webservice.
This must be set before requests are made.

`musicbrainzngs.``set_hostname`(*new\_hostname*, *use\_https=False*)[Â¶](#musicbrainzngs.set_hostname "Permalink to this definition")
Set the hostname for MusicBrainz webservice requests.
Defaults to âmusicbrainz.orgâ, accessing over https.
For backwards compatibility, use\_https is False by default.

| Parameters: | * **new\_hostname** ([*str*](https://python.readthedocs.io/en/latest/library/stdtypes.html#str "(in Python v3.7)")) â The hostname (and port) of the MusicBrainz server to connect to
* **use\_https** ([*bool*](https://python.readthedocs.io/en/latest/library/functions.html#bool "(in Python v3.7)")) â True if the host should be accessed using https. Default is False
 |

Specify a non-standard port by adding it to the hostname,
for example âlocalhost:8000â.

`musicbrainzngs.``set_caa_hostname`(*new\_hostname*, *use\_https=False*)[Â¶](#musicbrainzngs.set_caa_hostname "Permalink to this definition")
Set the base hostname for Cover Art Archive requests.
Defaults to âcoverartarchive.orgâ, accessing over https.
For backwards compatibility, use\_https is False by default.

| Parameters: | * **new\_hostname** ([*str*](https://python.readthedocs.io/en/latest/library/stdtypes.html#str "(in Python v3.7)")) â The hostname (and port) of the CAA server to connect to
* **use\_https** ([*bool*](https://python.readthedocs.io/en/latest/library/functions.html#bool "(in Python v3.7)")) â True if the host should be accessed using https. Default is False
 |

`musicbrainzngs.``set_parser`(*new\_parser\_fun=None*)[Â¶](#musicbrainzngs.set_parser "Permalink to this definition")
Sets the function used to parse the response from the
MusicBrainz web service.

If no parser is given, the parser is reset to the default parser
`mb\_parser\_xml()`.

`musicbrainzngs.``set_format`(*fmt='xml'*)[Â¶](#musicbrainzngs.set_format "Permalink to this definition")
Sets the format that should be returned by the Web Service.
The server currently supports xml and json.

This method will set a default parser for the specified format,
but you can modify it with [`set\_parser()`](#musicbrainzngs.set_parser "musicbrainzngs.set_parser").

Warning

The json format used by the server is different from
the json format returned by the musicbrainzngs internal parser
when using the xml format! This format may change at any time.

All of these functions will fetch a MusicBrainz entity or a list of entities
as a dict.
You can specify a list of includes to get more data
and you can filter on release\_status and release\_type.
See [`musicbrainz.VALID\_RELEASE\_STATUSES`](#musicbrainzngs.musicbrainz.VALID_RELEASE_STATUSES "musicbrainzngs.musicbrainz.VALID_RELEASE_STATUSES")
and [`musicbrainz.VALID\_RELEASE\_TYPES`](#musicbrainzngs.musicbrainz.VALID_RELEASE_TYPES "musicbrainzngs.musicbrainz.VALID_RELEASE_TYPES").
The valid includes are listed for each function.

`musicbrainzngs.``get_area_by_id`(*id*, *includes=[]*, *release\_status=[]*, *release\_type=[]*)[Â¶](#musicbrainzngs.get_area_by_id "Permalink to this definition")
Get the area with the MusicBrainz id as a dict with an âareaâ key.

*Available includes*: aliases, annotation, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``get_artist_by_id`(*id*, *includes=[]*, *release\_status=[]*, *release\_type=[]*)[Â¶](#musicbrainzngs.get_artist_by_id "Permalink to this definition")
Get the artist with the MusicBrainz id as a dict with an âartistâ key.

*Available includes*: recordings, releases, release-groups, works, various-artists, discids, media, isrcs, aliases, annotation, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels, tags, user-tags, ratings, user-ratings

`musicbrainzngs.``get_event_by_id`(*id*, *includes=[]*, *release\_status=[]*, *release\_type=[]*)[Â¶](#musicbrainzngs.get_event_by_id "Permalink to this definition")
Get the event with the MusicBrainz id as a dict with an âeventâ key.

The event dict has the following keys:
id, type, name, time, disambiguation and life-span.

*Available includes*: aliases, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels, tags, user-tags, ratings, user-ratings

`musicbrainzngs.``get_instrument_by_id`(*id*, *includes=[]*, *release\_status=[]*, *release\_type=[]*)[Â¶](#musicbrainzngs.get_instrument_by_id "Permalink to this definition")
Get the instrument with the MusicBrainz id as a dict with an âartistâ key.

*Available includes*: aliases, annotation, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels, tags, user-tags

`musicbrainzngs.``get_label_by_id`(*id*, *includes=[]*, *release\_status=[]*, *release\_type=[]*)[Â¶](#musicbrainzngs.get_label_by_id "Permalink to this definition")
Get the label with the MusicBrainz id as a dict with a âlabelâ key.

*Available includes*: releases, discids, media, aliases, annotation, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels, tags, user-tags, ratings, user-ratings

`musicbrainzngs.``get_place_by_id`(*id*, *includes=[]*, *release\_status=[]*, *release\_type=[]*)[Â¶](#musicbrainzngs.get_place_by_id "Permalink to this definition")
Get the place with the MusicBrainz id as a dict with an âplaceâ key.

*Available includes*: aliases, annotation, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels, tags, user-tags

`musicbrainzngs.``get_recording_by_id`(*id*, *includes=[]*, *release\_status=[]*, *release\_type=[]*)[Â¶](#musicbrainzngs.get_recording_by_id "Permalink to this definition")
Get the recording with the MusicBrainz id as a dict
with a ârecordingâ key.

*Available includes*: artists, releases, discids, media, artist-credits, isrcs, work-level-rels, annotation, aliases, tags, user-tags, ratings, user-ratings, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``get_recordings_by_isrc`(*isrc*, *includes=[]*, *release\_status=[]*, *release\_type=[]*)[Â¶](#musicbrainzngs.get_recordings_by_isrc "Permalink to this definition")
Search for recordings with an [ISRC](https://musicbrainz.org/doc/ISRC).
The result is a dict with an âisrcâ key,
which again includes a ârecording-listâ.

*Available includes*: artists, releases, discids, media, artist-credits, isrcs, work-level-rels, annotation, aliases, tags, user-tags, ratings, user-ratings, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``get_release_group_by_id`(*id*, *includes=[]*, *release\_status=[]*, *release\_type=[]*)[Â¶](#musicbrainzngs.get_release_group_by_id "Permalink to this definition")
Get the release group with the MusicBrainz id as a dict
with a ârelease-groupâ key.

*Available includes*: artists, releases, discids, media, artist-credits, annotation, aliases, tags, user-tags, ratings, user-ratings, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``get_release_by_id`(*id*, *includes=[]*, *release\_status=[]*, *release\_type=[]*)[Â¶](#musicbrainzngs.get_release_by_id "Permalink to this definition")
Get the release with the MusicBrainz id as a dict with a âreleaseâ key.

*Available includes*: artists, labels, recordings, release-groups, media, artist-credits, discids, isrcs, recording-level-rels, work-level-rels, annotation, aliases, tags, user-tags, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``get_releases_by_discid`(*id*, *includes=[]*, *toc=None*, *cdstubs=True*, *media\_format=None*)[Â¶](#musicbrainzngs.get_releases_by_discid "Permalink to this definition")
Search for releases with a [Disc ID](https://musicbrainz.org/doc/Disc ID) or table of contents.

When a toc is provided and no release with the disc ID is found,
a fuzzy search by the toc is done.
The toc should have to same format as [`discid.Disc.toc\_string`](https://python-discid.readthedocs.io/en/latest/api/#discid.Disc.toc_string "(in python-discid v1.1)").
When a toc is provided, the format of the discid itself is not
checked server-side, so any value may be passed if searching by only
toc is desired.

If no toc matches in musicbrainz but a [CD Stub](https://musicbrainz.org/doc/CD Stub) does,
the CD Stub will be returned. Prevent this from happening by
passing cdstubs=False.

By default only results that match a format that allows discids
(e.g. CD) are included. To include all media formats, pass
media\_format=âallâ.

The result is a dict with either a âdiscâ , a âcdstubâ key
or a ârelease-listâ (fuzzy match with TOC).
A âdiscâ has an âoffset-countâ, an âoffset-listâ and a ârelease-listâ.
A âcdstubâ key has direct âartistâ and âtitleâ keys.

*Available includes*: artists, labels, recordings, release-groups, media, artist-credits, discids, isrcs, recording-level-rels, work-level-rels, annotation, aliases, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``get_series_by_id`(*id*, *includes=[]*)[Â¶](#musicbrainzngs.get_series_by_id "Permalink to this definition")
Get the series with the MusicBrainz id as a dict with a âseriesâ key.

*Available includes*: annotation, aliases, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``get_work_by_id`(*id*, *includes=[]*)[Â¶](#musicbrainzngs.get_work_by_id "Permalink to this definition")
Get the work with the MusicBrainz id as a dict with a âworkâ key.

*Available includes*: aliases, annotation, tags, user-tags, ratings, user-ratings, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``get_works_by_iswc`(*iswc*, *includes=[]*)[Â¶](#musicbrainzngs.get_works_by_iswc "Permalink to this definition")
Search for works with an [ISWC](https://musicbrainz.org/doc/ISWC).
The result is a dict with a`work-list`.

*Available includes*: aliases, annotation, tags, user-tags, ratings, user-ratings, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``get_url_by_id`(*id*, *includes=[]*)[Â¶](#musicbrainzngs.get_url_by_id "Permalink to this definition")
Get the url with the MusicBrainz id as a dict with a âurlâ key.

*Available includes*: area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``get_collections`()[Â¶](#musicbrainzngs.get_collections "Permalink to this definition")
List the collections for the currently [`authenticated`](#musicbrainzngs.auth "musicbrainzngs.auth") user
as a dict with a âcollection-listâ key.

`musicbrainzngs.``get_releases_in_collection`(*collection*, *limit=None*, *offset=None*)[Â¶](#musicbrainzngs.get_releases_in_collection "Permalink to this definition")
List the releases in a collection.
Returns a dict with a âcollectionâ key, which again has a ârelease-listâ.

See [Browsing](#browsing) for how to use limit and offset.

`musicbrainzngs.musicbrainz.``VALID_RELEASE_TYPES` *= ['nat', 'album', 'single', 'ep', 'broadcast', 'other', 'compilation', 'soundtrack', 'spokenword', 'interview', 'audiobook', 'live', 'remix', 'dj-mix', 'mixtape/street']*[Â¶](#musicbrainzngs.musicbrainz.VALID_RELEASE_TYPES "Permalink to this definition")
These can be used to filter whenever releases are includes or browsed

`musicbrainzngs.musicbrainz.``VALID_RELEASE_STATUSES` *= ['official', 'promotion', 'bootleg', 'pseudo-release']*[Â¶](#musicbrainzngs.musicbrainz.VALID_RELEASE_STATUSES "Permalink to this definition")
These can be used to filter whenever releases or release-groups are involved

`musicbrainzngs.``get_image_list`(*releaseid*)[Â¶](#musicbrainzngs.get_image_list "Permalink to this definition")
Get the list of cover art associated with a release.

The return value is the deserialized response of the [JSON listing](http://musicbrainz.org/doc/Cover_Art_Archive/API#.2Frelease.2F.7Bmbid.7D.2F)
returned by the Cover Art Archive API.

If an error occurs then a [`ResponseError`](#musicbrainzngs.ResponseError "musicbrainzngs.ResponseError") will
be raised with one of the following HTTP codes:

* 400: Releaseid is not a valid UUID
* 404: No release exists with an MBID of releaseid
* 503: Ratelimit exceeded

`musicbrainzngs.``get_release_group_image_list`(*releasegroupid*)[Â¶](#musicbrainzngs.get_release_group_image_list "Permalink to this definition")
Get the list of cover art associated with a release group.

The return value is the deserialized response of the [JSON listing](http://musicbrainz.org/doc/Cover_Art_Archive/API#.2Frelease-group.2F.7Bmbid.7D.2F)
returned by the Cover Art Archive API.

If an error occurs then a [`ResponseError`](#musicbrainzngs.ResponseError "musicbrainzngs.ResponseError") will
be raised with one of the following HTTP codes:

* 400: Releaseid is not a valid UUID
* 404: No release exists with an MBID of releaseid
* 503: Ratelimit exceeded

`musicbrainzngs.``get_image`(*mbid*, *coverid*, *size=None*, *entitytype='release'*)[Â¶](#musicbrainzngs.get_image "Permalink to this definition")
Download cover art for a release. The coverart file to download
is specified by the coverid argument.

If size is not specified, download the largest copy present, which can be
very large.

If an error occurs then a [`ResponseError`](#musicbrainzngs.ResponseError "musicbrainzngs.ResponseError")
will be raised with one of the following HTTP codes:

* 400: Releaseid is not a valid UUID or coverid is invalid
* 404: No release exists with an MBID of releaseid
* 503: Ratelimit exceeded

| Parameters: | * **coverid** ([*int*](https://python.readthedocs.io/en/latest/library/functions.html#int "(in Python v3.7)") *or* [*str*](https://python.readthedocs.io/en/latest/library/stdtypes.html#str "(in Python v3.7)")) â `front`, `back` or a number from the listing obtained with
[`get\_image\_list()`](#musicbrainzngs.get_image_list "musicbrainzngs.get_image_list")
* **size** ([*str*](https://python.readthedocs.io/en/latest/library/stdtypes.html#str "(in Python v3.7)") *or* [*None*](https://python.readthedocs.io/en/v2.7.2/library/constants.html#None "(in Python v2.7)")) â â250â, â500â, â1200â or None. If it is None, the largest
available picture will be downloaded. If the image originally
uploaded to the Cover Art Archive was smaller than the
requested size, only the original image will be returned.
* **entitytype** ([*str*](https://python.readthedocs.io/en/latest/library/stdtypes.html#str "(in Python v3.7)")) â The type of entity for which to download the cover art.
This is either `release` or `release-group`.
 |
| Returns: | The binary image data |
| Type: | [str](https://python.readthedocs.io/en/latest/library/stdtypes.html#str "(in Python v3.7)") |

`musicbrainzngs.``get_image_front`(*releaseid*, *size=None*)[Â¶](#musicbrainzngs.get_image_front "Permalink to this definition")
Download the front cover art for a release.
The size argument and the possible error conditions are the same as for
[`get\_image()`](#musicbrainzngs.get_image "musicbrainzngs.get_image").

`musicbrainzngs.``get_release_group_image_front`(*releasegroupid*, *size=None*)[Â¶](#musicbrainzngs.get_release_group_image_front "Permalink to this definition")
Download the front cover art for a release group.
The size argument and the possible error conditions are the same as for
[`get\_image()`](#musicbrainzngs.get_image "musicbrainzngs.get_image").

`musicbrainzngs.``get_image_back`(*releaseid*, *size=None*)[Â¶](#musicbrainzngs.get_image_back "Permalink to this definition")
Download the back cover art for a release.
The size argument and the possible error conditions are the same as for
[`get\_image()`](#musicbrainzngs.get_image "musicbrainzngs.get_image").

For all of these search functions you can use any of the allowed search fields
as parameter names.
The documentation of what these fields do is on
[Development/XML Web Service/Version 2/Search](https://musicbrainz.org/doc/Development/XML Web Service/Version 2/Search).

You can also set the query parameter to any lucene query you like.
When you use any of the search fields as parameters,
special characters are escaped in the query.

By default the elements are concatenated with spaces in between,
so lucene essentially does a fuzzy search.
That search might include results that donât match the complete query,
though these will be ranked lower than the ones that do.
If you want all query elements to match for all results,
you have to set strict=True.

By default the web service returns 25 results per request and you can set
a limit of up to 100.
You have to use the offset parameter to set how many results you have
already seen so the web service doesnât give you the same results again.

`musicbrainzngs.``search_annotations`(*query=''*, *limit=None*, *offset=None*, *strict=False*, *\*\*fields*)[Â¶](#musicbrainzngs.search_annotations "Permalink to this definition")
Search for annotations and return a dict with an âannotation-listâ key.

*Available search fields*: entity, name, text, type

`musicbrainzngs.``search_areas`(*query=''*, *limit=None*, *offset=None*, *strict=False*, *\*\*fields*)[Â¶](#musicbrainzngs.search_areas "Permalink to this definition")
Search for areas and return a dict with an âarea-listâ key.

*Available search fields*: aid, alias, area, areaaccent, begin, comment, end, ended, iso, iso1, iso2, iso3, sortname, tag, type

`musicbrainzngs.``search_artists`(*query=''*, *limit=None*, *offset=None*, *strict=False*, *\*\*fields*)[Â¶](#musicbrainzngs.search_artists "Permalink to this definition")
Search for artists and return a dict with an âartist-listâ key.

*Available search fields*: alias, area, arid, artist, artistaccent, begin, beginarea, comment, country, end, endarea, ended, gender, ipi, isni, primary\_alias, sortname, tag, type

`musicbrainzngs.``search_events`(*query=''*, *limit=None*, *offset=None*, *strict=False*, *\*\*fields*)[Â¶](#musicbrainzngs.search_events "Permalink to this definition")
Search for events and return a dict with an âevent-listâ key.

*Available search fields*: aid, alias, area, arid, artist, begin, comment, eid, end, ended, event, eventaccent, pid, place, tag, type

`musicbrainzngs.``search_instruments`(*query=''*, *limit=None*, *offset=None*, *strict=False*, *\*\*fields*)[Â¶](#musicbrainzngs.search_instruments "Permalink to this definition")
Search for instruments and return a dict with a âinstrument-listâ key.

*Available search fields*: alias, comment, description, iid, instrument, instrumentaccent, tag, type

`musicbrainzngs.``search_labels`(*query=''*, *limit=None*, *offset=None*, *strict=False*, *\*\*fields*)[Â¶](#musicbrainzngs.search_labels "Permalink to this definition")
Search for labels and return a dict with a âlabel-listâ key.

*Available search fields*: alias, area, begin, code, comment, country, end, ended, ipi, label, labelaccent, laid, release\_count, sortname, tag, type

`musicbrainzngs.``search_places`(*query=''*, *limit=None*, *offset=None*, *strict=False*, *\*\*fields*)[Â¶](#musicbrainzngs.search_places "Permalink to this definition")
Search for places and return a dict with a âplace-listâ key.

*Available search fields*: address, alias, area, begin, comment, end, ended, lat, long, pid, place, placeaccent, type

`musicbrainzngs.``search_recordings`(*query=''*, *limit=None*, *offset=None*, *strict=False*, *\*\*fields*)[Â¶](#musicbrainzngs.search_recordings "Permalink to this definition")
Search for recordings and return a dict with a ârecording-listâ key.

*Available search fields*: alias, arid, artist, artistname, comment, country, creditname, date, dur, format, isrc, number, position, primarytype, qdur, recording, recordingaccent, reid, release, rgid, rid, secondarytype, status, tag, tid, tnum, tracks, tracksrelease, type, video

`musicbrainzngs.``search_release_groups`(*query=''*, *limit=None*, *offset=None*, *strict=False*, *\*\*fields*)[Â¶](#musicbrainzngs.search_release_groups "Permalink to this definition")
Search for release groups and return a dict
with a ârelease-group-listâ key.

*Available search fields*: alias, arid, artist, artistname, comment, creditname, primarytype, reid, release, releasegroup, releasegroupaccent, releases, rgid, secondarytype, status, tag, type

`musicbrainzngs.``search_releases`(*query=''*, *limit=None*, *offset=None*, *strict=False*, *\*\*fields*)[Â¶](#musicbrainzngs.search_releases "Permalink to this definition")
Search for recordings and return a dict with a ârecording-listâ key.

*Available search fields*: alias, arid, artist, artistname, asin, barcode, catno, comment, country, creditname, date, discids, discidsmedium, format, label, laid, lang, mediums, primarytype, quality, reid, release, releaseaccent, rgid, script, secondarytype, status, tag, tracks, tracksmedium, type

`musicbrainzngs.``search_series`(*query=''*, *limit=None*, *offset=None*, *strict=False*, *\*\*fields*)[Â¶](#musicbrainzngs.search_series "Permalink to this definition")
Search for series and return a dict with a âseries-listâ key.

*Available search fields*: alias, comment, orderingattribute, series, seriesaccent, sid, tag, type

`musicbrainzngs.``search_works`(*query=''*, *limit=None*, *offset=None*, *strict=False*, *\*\*fields*)[Â¶](#musicbrainzngs.search_works "Permalink to this definition")
Search for works and return a dict with a âwork-listâ key.

*Available search fields*: alias, arid, artist, comment, iswc, lang, recording, recording\_count, rid, tag, type, wid, work, workaccent

You can browse entitities of a certain type linked to one specific entity.
That is you can browse all recordings by an artist, for example.

These functions can be used to to include more than the maximum of 25 linked
entities returned by the functions in [Getting Data](#getting-data).
You can set a limit as high as 100. The default is still 25.
Similar to the functions in [Searching](#searching), you have to specify
an offset to see the results you havenât seen yet.

You have to provide exactly one MusicBrainz ID to these functions.

`musicbrainzngs.``browse_artists`(*recording=None*, *release=None*, *release\_group=None*, *work=None*, *includes=[]*, *limit=None*, *offset=None*)[Â¶](#musicbrainzngs.browse_artists "Permalink to this definition")
Get all artists linked to a recording, a release or a release group.
You need to give one MusicBrainz ID.

*Available includes*: aliases, tags, user-tags, ratings, user-ratings, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``browse_events`(*area=None*, *artist=None*, *place=None*, *includes=[]*, *limit=None*, *offset=None*)[Â¶](#musicbrainzngs.browse_events "Permalink to this definition")
Get all events linked to a area, a artist or a place.
You need to give one MusicBrainz ID.

*Available includes*: aliases, tags, user-tags, ratings, user-ratings, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``browse_labels`(*release=None*, *includes=[]*, *limit=None*, *offset=None*)[Â¶](#musicbrainzngs.browse_labels "Permalink to this definition")
Get all labels linked to a relase. You need to give a MusicBrainz ID.

*Available includes*: aliases, tags, user-tags, ratings, user-ratings, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``browse_places`(*area=None*, *includes=[]*, *limit=None*, *offset=None*)[Â¶](#musicbrainzngs.browse_places "Permalink to this definition")
Get all places linked to an area. You need to give a MusicBrainz ID.

*Available includes*: aliases, tags, user-tags, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``browse_recordings`(*artist=None*, *release=None*, *includes=[]*, *limit=None*, *offset=None*)[Â¶](#musicbrainzngs.browse_recordings "Permalink to this definition")
Get all recordings linked to an artist or a release.
You need to give one MusicBrainz ID.

*Available includes*: artist-credits, isrcs, tags, user-tags, ratings, user-ratings, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``browse_release_groups`(*artist=None*, *release=None*, *release\_type=[]*, *includes=[]*, *limit=None*, *offset=None*)[Â¶](#musicbrainzngs.browse_release_groups "Permalink to this definition")
Get all release groups linked to an artist or a release.
You need to give one MusicBrainz ID.

You can filter by [`musicbrainz.VALID\_RELEASE\_TYPES`](#musicbrainzngs.musicbrainz.VALID_RELEASE_TYPES "musicbrainzngs.musicbrainz.VALID_RELEASE_TYPES").

*Available includes*: artist-credits, tags, user-tags, ratings, user-ratings, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``browse_releases`(*artist=None*, *track\_artist=None*, *label=None*, *recording=None*, *release\_group=None*, *release\_status=[]*, *release\_type=[]*, *includes=[]*, *limit=None*, *offset=None*)[Â¶](#musicbrainzngs.browse_releases "Permalink to this definition")
Get all releases linked to an artist, a label, a recording
or a release group. You need to give one MusicBrainz ID.

You can also browse by track\_artist, which gives all releases where some
tracks are attributed to that artist, but not the whole release.

You can filter by [`musicbrainz.VALID\_RELEASE\_TYPES`](#musicbrainzngs.musicbrainz.VALID_RELEASE_TYPES "musicbrainzngs.musicbrainz.VALID_RELEASE_TYPES") or
[`musicbrainz.VALID\_RELEASE\_STATUSES`](#musicbrainzngs.musicbrainz.VALID_RELEASE_STATUSES "musicbrainzngs.musicbrainz.VALID_RELEASE_STATUSES").

*Available includes*: artist-credits, labels, recordings, isrcs, release-groups, media, discids, area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

`musicbrainzngs.``browse_urls`(*resource=None*, *includes=[]*, *limit=None*, *offset=None*)[Â¶](#musicbrainzngs.browse_urls "Permalink to this definition")
Get urls by actual URL string.
You need to give a URL string as âresourceâ

*Available includes*: area-rels, artist-rels, label-rels, place-rels, event-rels, recording-rels, release-rels, release-group-rels, series-rels, url-rels, work-rels, instrument-rels

These are the only functions that write to the MusicBrainz database.
They take one or more dicts with multiple entities as keys,
which take certain values or a list of values.

You have to use [`auth()`](#musicbrainzngs.auth "musicbrainzngs.auth") before using any of these functions.

`musicbrainzngs.``submit_barcodes`(*release\_barcode*)[Â¶](#musicbrainzngs.submit_barcodes "Permalink to this definition")
Submits a set of {release\_id1: barcode, â¦}

`musicbrainzngs.``submit_isrcs`(*recording\_isrcs*)[Â¶](#musicbrainzngs.submit_isrcs "Permalink to this definition")
Submit ISRCs.
Submits a set of {recording-id1: [isrc1, â¦], â¦}
or {recording\_id1: isrc, â¦}.

`musicbrainzngs.``submit_tags`(*\*\*kwargs*)[Â¶](#musicbrainzngs.submit_tags "Permalink to this definition")
Submit user tags.
Takes parameters named e.g. âartist\_tagsâ, ârecording\_tagsâ, etc.,
and of the form:
{entity\_id1: [tag1, â¦], â¦}
If you only have one tag for an entity you can use a string instead
of a list.

The userâs tags for each entity will be set to that list, adding or
removing tags as necessary. Submitting an empty list for an entity
will remove all tags for that entity by the user.

`musicbrainzngs.``submit_ratings`(*\*\*kwargs*)[Â¶](#musicbrainzngs.submit_ratings "Permalink to this definition")
Submit user ratings.
Takes parameters named e.g. âartist\_ratingsâ, ârecording\_ratingsâ, etc.,
and of the form:
{entity\_id1: rating, â¦}

Ratings are numbers from 0-100, at intervals of 20 (20 per âstarâ).
Submitting a rating of 0 will remove the userâs rating.

`musicbrainzngs.``add_releases_to_collection`(*collection*, *releases=[]*)[Â¶](#musicbrainzngs.add_releases_to_collection "Permalink to this definition")
Add releases to a collection.
Collection and releases should be identified by their MBIDs

`musicbrainzngs.``remove_releases_from_collection`(*collection*, *releases=[]*)[Â¶](#musicbrainzngs.remove_releases_from_collection "Permalink to this definition")
Remove releases from a collection.
Collection and releases should be identified by their MBIDs

These are the main exceptions that are raised by functions in musicbrainzngs.
You might want to catch some of these at an appropriate point in your code.

Some of these might have subclasses that are not listed here.

*class* `musicbrainzngs.``MusicBrainzError`[Â¶](#musicbrainzngs.MusicBrainzError "Permalink to this definition")
Base class for all exceptions related to MusicBrainz.

*class* `musicbrainzngs.``UsageError`[Â¶](#musicbrainzngs.UsageError "Permalink to this definition")
Bases: `musicbrainzngs.musicbrainz.MusicBrainzError`

Error related to misuse of the module API.

*class* `musicbrainzngs.``WebServiceError`(*message=None*, *cause=None*)[Â¶](#musicbrainzngs.WebServiceError "Permalink to this definition")
Bases: `musicbrainzngs.musicbrainz.MusicBrainzError`

Error related to MusicBrainz API requests.

*class* `musicbrainzngs.``AuthenticationError`(*message=None*, *cause=None*)[Â¶](#musicbrainzngs.AuthenticationError "Permalink to this definition")
Bases: `musicbrainzngs.musicbrainz.WebServiceError`

Received a HTTP 401 response while accessing a protected resource.

*class* `musicbrainzngs.``NetworkError`(*message=None*, *cause=None*)[Â¶](#musicbrainzngs.NetworkError "Permalink to this definition")
Bases: `musicbrainzngs.musicbrainz.WebServiceError`

Problem communicating with the MB server.

*class* `musicbrainzngs.``ResponseError`(*message=None*, *cause=None*)[Â¶](#musicbrainzngs.ResponseError "Permalink to this definition")
Bases: `musicbrainzngs.musicbrainz.WebServiceError`

Bad response sent by the MB server.

musicbrainzngs logs debug and informational messages using Pythonâs
[`logging`](https://python.readthedocs.io/en/v2.7.2/library/logging.html#module-logging "(in Python v2.7)") module.
All logging is done in the logger with the name musicbrainzngs.

You can enable this output in your application with:

```
import logging
logging.basicConfig(level=logging.DEBUG)
# optionally restrict musicbrainzngs output to INFO messages
logging.getLogger("musicbrainzngs").setLevel(logging.INFO)

```

* [API](#)
	+ [General](#general)
	+ [Getting Data](#getting-data)
	+ [Cover Art](#cover-art)
	+ [Searching](#searching)
	+ [Browsing](#browsing)
	+ [Submitting](#submitting)
	+ [Exceptions](#exceptions)
	+ [Logging](#logging)

[Usage](../usage/ "previous chapter")

* [index](../genindex/ "General Index")
* [modules](../py-modindex/ "Python Module Index") |
* [previous](../usage/ "Usage") |
* [musicbrainzngs 0.7.1 documentation](../) »

 © Copyright 2012, Alastair Porter et al.
 Last updated on Jan 11, 2020.
 Created using [Sphinx](http://sphinx-doc.org/) 1.8.5.

---

# Index — musicbrainzngs 0.7.1 documentation

Index — musicbrainzngs 0.7.1 documentation

* [index](# "General Index")
* [modules](../py-modindex/ "Python Module Index") |
* [musicbrainzngs 0.7.1 documentation](../) »

[**A**](#A)
 | [**B**](#B)
 | [**G**](#G)
 | [**M**](#M)
 | [**N**](#N)
 | [**R**](#R)
 | [**S**](#S)
 | [**U**](#U)
 | [**V**](#V)
 | [**W**](#W)

|  |  |
| --- | --- |
| * [add\_releases\_to\_collection() (in module musicbrainzngs)](../api/#musicbrainzngs.add_releases_to_collection)
 | * [auth() (in module musicbrainzngs)](../api/#musicbrainzngs.auth)
* [AuthenticationError (class in musicbrainzngs)](../api/#musicbrainzngs.AuthenticationError)
 |

|  |  |
| --- | --- |
| * [browse\_artists() (in module musicbrainzngs)](../api/#musicbrainzngs.browse_artists)
* [browse\_events() (in module musicbrainzngs)](../api/#musicbrainzngs.browse_events)
* [browse\_labels() (in module musicbrainzngs)](../api/#musicbrainzngs.browse_labels)
* [browse\_places() (in module musicbrainzngs)](../api/#musicbrainzngs.browse_places)
 | * [browse\_recordings() (in module musicbrainzngs)](../api/#musicbrainzngs.browse_recordings)
* [browse\_release\_groups() (in module musicbrainzngs)](../api/#musicbrainzngs.browse_release_groups)
* [browse\_releases() (in module musicbrainzngs)](../api/#musicbrainzngs.browse_releases)
* [browse\_urls() (in module musicbrainzngs)](../api/#musicbrainzngs.browse_urls)
 |

|  |  |
| --- | --- |
| * [get\_area\_by\_id() (in module musicbrainzngs)](../api/#musicbrainzngs.get_area_by_id)
* [get\_artist\_by\_id() (in module musicbrainzngs)](../api/#musicbrainzngs.get_artist_by_id)
* [get\_collections() (in module musicbrainzngs)](../api/#musicbrainzngs.get_collections)
* [get\_event\_by\_id() (in module musicbrainzngs)](../api/#musicbrainzngs.get_event_by_id)
* [get\_image() (in module musicbrainzngs)](../api/#musicbrainzngs.get_image)
* [get\_image\_back() (in module musicbrainzngs)](../api/#musicbrainzngs.get_image_back)
* [get\_image\_front() (in module musicbrainzngs)](../api/#musicbrainzngs.get_image_front)
* [get\_image\_list() (in module musicbrainzngs)](../api/#musicbrainzngs.get_image_list)
* [get\_instrument\_by\_id() (in module musicbrainzngs)](../api/#musicbrainzngs.get_instrument_by_id)
* [get\_label\_by\_id() (in module musicbrainzngs)](../api/#musicbrainzngs.get_label_by_id)
* [get\_place\_by\_id() (in module musicbrainzngs)](../api/#musicbrainzngs.get_place_by_id)
 | * [get\_recording\_by\_id() (in module musicbrainzngs)](../api/#musicbrainzngs.get_recording_by_id)
* [get\_recordings\_by\_isrc() (in module musicbrainzngs)](../api/#musicbrainzngs.get_recordings_by_isrc)
* [get\_release\_by\_id() (in module musicbrainzngs)](../api/#musicbrainzngs.get_release_by_id)
* [get\_release\_group\_by\_id() (in module musicbrainzngs)](../api/#musicbrainzngs.get_release_group_by_id)
* [get\_release\_group\_image\_front() (in module musicbrainzngs)](../api/#musicbrainzngs.get_release_group_image_front)
* [get\_release\_group\_image\_list() (in module musicbrainzngs)](../api/#musicbrainzngs.get_release_group_image_list)
* [get\_releases\_by\_discid() (in module musicbrainzngs)](../api/#musicbrainzngs.get_releases_by_discid)
* [get\_releases\_in\_collection() (in module musicbrainzngs)](../api/#musicbrainzngs.get_releases_in_collection)
* [get\_series\_by\_id() (in module musicbrainzngs)](../api/#musicbrainzngs.get_series_by_id)
* [get\_url\_by\_id() (in module musicbrainzngs)](../api/#musicbrainzngs.get_url_by_id)
* [get\_work\_by\_id() (in module musicbrainzngs)](../api/#musicbrainzngs.get_work_by_id)
* [get\_works\_by\_iswc() (in module musicbrainzngs)](../api/#musicbrainzngs.get_works_by_iswc)
 |

|  |  |
| --- | --- |
| * [MusicBrainzError (class in musicbrainzngs)](../api/#musicbrainzngs.MusicBrainzError)
 | * [musicbrainzngs (module)](../api/#module-musicbrainzngs)
 |

|  |
| --- |
| * [NetworkError (class in musicbrainzngs)](../api/#musicbrainzngs.NetworkError)
 |

|  |  |
| --- | --- |
| * [remove\_releases\_from\_collection() (in module musicbrainzngs)](../api/#musicbrainzngs.remove_releases_from_collection)
 | * [ResponseError (class in musicbrainzngs)](../api/#musicbrainzngs.ResponseError)
 |

|  |  |
| --- | --- |
| * [search\_annotations() (in module musicbrainzngs)](../api/#musicbrainzngs.search_annotations)
* [search\_areas() (in module musicbrainzngs)](../api/#musicbrainzngs.search_areas)
* [search\_artists() (in module musicbrainzngs)](../api/#musicbrainzngs.search_artists)
* [search\_events() (in module musicbrainzngs)](../api/#musicbrainzngs.search_events)
* [search\_instruments() (in module musicbrainzngs)](../api/#musicbrainzngs.search_instruments)
* [search\_labels() (in module musicbrainzngs)](../api/#musicbrainzngs.search_labels)
* [search\_places() (in module musicbrainzngs)](../api/#musicbrainzngs.search_places)
* [search\_recordings() (in module musicbrainzngs)](../api/#musicbrainzngs.search_recordings)
* [search\_release\_groups() (in module musicbrainzngs)](../api/#musicbrainzngs.search_release_groups)
* [search\_releases() (in module musicbrainzngs)](../api/#musicbrainzngs.search_releases)
* [search\_series() (in module musicbrainzngs)](../api/#musicbrainzngs.search_series)
 | * [search\_works() (in module musicbrainzngs)](../api/#musicbrainzngs.search_works)
* [set\_caa\_hostname() (in module musicbrainzngs)](../api/#musicbrainzngs.set_caa_hostname)
* [set\_format() (in module musicbrainzngs)](../api/#musicbrainzngs.set_format)
* [set\_hostname() (in module musicbrainzngs)](../api/#musicbrainzngs.set_hostname)
* [set\_parser() (in module musicbrainzngs)](../api/#musicbrainzngs.set_parser)
* [set\_rate\_limit() (in module musicbrainzngs)](../api/#musicbrainzngs.set_rate_limit)
* [set\_useragent() (in module musicbrainzngs)](../api/#musicbrainzngs.set_useragent)
* [submit\_barcodes() (in module musicbrainzngs)](../api/#musicbrainzngs.submit_barcodes)
* [submit\_isrcs() (in module musicbrainzngs)](../api/#musicbrainzngs.submit_isrcs)
* [submit\_ratings() (in module musicbrainzngs)](../api/#musicbrainzngs.submit_ratings)
* [submit\_tags() (in module musicbrainzngs)](../api/#musicbrainzngs.submit_tags)
 |

|  |
| --- |
| * [UsageError (class in musicbrainzngs)](../api/#musicbrainzngs.UsageError)
 |

|  |  |
| --- | --- |
| * [VALID\_RELEASE\_STATUSES (in module musicbrainzngs.musicbrainz)](../api/#musicbrainzngs.musicbrainz.VALID_RELEASE_STATUSES)
 | * [VALID\_RELEASE\_TYPES (in module musicbrainzngs.musicbrainz)](../api/#musicbrainzngs.musicbrainz.VALID_RELEASE_TYPES)
 |

|  |
| --- |
| * [WebServiceError (class in musicbrainzngs)](../api/#musicbrainzngs.WebServiceError)
 |

* [index](# "General Index")
* [modules](../py-modindex/ "Python Module Index") |
* [musicbrainzngs 0.7.1 documentation](../) »

 © Copyright 2012, Alastair Porter et al.
 Last updated on Jan 11, 2020.
 Created using [Sphinx](http://sphinx-doc.org/) 1.8.5.

---

# Search — musicbrainzngs 0.7.1 documentation

Search — musicbrainzngs 0.7.1 documentation

* [index](../genindex/ "General Index")
* [modules](../py-modindex/ "Python Module Index") |
* [musicbrainzngs 0.7.1 documentation](../) »

 Please activate JavaScript to enable the search
 functionality.
 

 From here you can search these documents. Enter your search
 words into the box below and click "search". Note that the search
 function will automatically search for all of the words. Pages
 containing fewer words won't appear in the result list.
 

* [index](../genindex/ "General Index")
* [modules](../py-modindex/ "Python Module Index") |
* [musicbrainzngs 0.7.1 documentation](../) »

 © Copyright 2012, Alastair Porter et al.
 Last updated on Jan 11, 2020.
 Created using [Sphinx](http://sphinx-doc.org/) 1.8.5.