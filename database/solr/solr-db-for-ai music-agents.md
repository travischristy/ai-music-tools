# Apache Solr 9.9 Reference Guide for AI Music Agents

This guide provides essential information for using and upgrading to Apache Solr 9.9, tailored for the AI Music Tools project.

## Key Changes in Solr 9

When upgrading to Solr 9, it's important to be aware of the following major changes:

- **Java 11 Requirement**: Solr 9 requires Java 11 or later.
- **HTTP/2 by Default**: Solr now uses HTTP/2 as the default protocol for internal communication. For rolling upgrades from Solr 8, you may need to force HTTP/1.1 temporarily.
- **Package Renaming**: Many packages have been renamed from `org.apache.solr` to `org.apache.solr.api`, `org.apache.solr.client`, etc.
- **Obsolete Configuration**: Some parameters in `solrconfig.xml` are now obsolete, such as `numVersionBuckets` and `versionBucketLockTimeoutMs`.

## Core Configuration (`solrconfig.xml`)

Here are some common configuration snippets for `solrconfig.xml`.

### Update Handler

The `updateLog` is essential for durability and recovery.

```xml
<updateHandler>
  <updateLog>
    <str name="dir">${solr.data.dir:}</str>
  </updateLog>
</updateHandler>
```

### Update Request Processor Chain

Update processor chains allow you to define a sequence of operations to perform on documents during indexing.

```xml
<updateRequestProcessorChain name="add-unknown-fields-to-the-schema" default="${update.autoCreateFields:true}"
         processor="uuid,remove-blank,field-name-mutating,parse-boolean,parse-long,parse-double,parse-date,add-schema-fields">
  <processor class="solr.LogUpdateProcessorFactory"/>
  <processor class="solr.DistributedUpdateProcessorFactory"/>
  <processor class="solr.RunUpdateProcessorFactory"/>
</updateRequestProcessorChain>
```

## Indexing Data

Here are examples of how to index data using `curl`.

### Indexing JSON Documents

```bash
curl -X POST -H 'Content-Type: application/json' 'http://localhost:8983/solr/my_collection/update/json/docs' --data-binary '
{
  "id": "1",
  "title": "Doc 1"
}'
```

### Indexing XML Documents

```bash
curl http://localhost:8983/solr/my_collection/update -H "Content-Type: text/xml" --data-binary '
<add>
  <doc>
    <field name="authors">Patrick Eagar</field>
    <field name="subject">Sports</field>
  </doc>
</add>'
```

### Atomic Updates

Partial document updates allow you to modify specific fields without re-indexing the entire document.

**Original Document:**
```json
{
 "id":"mydoc",
 "price":10,
 "popularity":42
}
```

**Update Command:**
```json
{
 "id":"mydoc",
 "price":{"set":99},
 "popularity":{"inc":20}
}
```

**Resulting Document:**
```json
{
 "id":"mydoc",
 "price":99,
 "popularity":62
}
```


-   Getting Started
    -   [Introduction to Solr](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../getting-started/introduction.html)
    -   Solr Concepts
    -   [Solr Tutorials](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../getting-started/solr-tutorial.html)
    -   [Solr Admin UI](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../getting-started/solr-admin-ui.html)
    -   [About This Guide](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../getting-started/about-this-guide.html)
-   Deployment Guide
    -   [Solr Control Script Reference](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../deployment-guide/solr-control-script-reference.html)
    -   Installation & Deployment
    -   Scaling Solr
    -   Monitoring Solr
    -   [Securing Solr](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../deployment-guide/securing-solr.html)
    -   [Client APIs](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../deployment-guide/client-apis.html)
-   Configuration Guide
    -   [Solr Configuration Files](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../configuration-guide/configuration-files.html)
    -   [Property Substitution in Configuration Files](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../configuration-guide/property-substitution.html)
    -   [Core Discovery](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../configuration-guide/core-discovery.html)
    -   [Configuring solr.xml](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../configuration-guide/configuring-solr-xml.html)
    -   [Configuring solrconfig.xml](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../configuration-guide/configuring-solrconfig-xml.html)
    -   Configuration APIs
    -   [Configsets](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../configuration-guide/config-sets.html)
    -   [Resource Loading](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../configuration-guide/resource-loading.html)
    -   [Solr Plugins](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../configuration-guide/solr-plugins.html)
-   Schema and Indexing Guide
    -   Solr Schema
    -   Fields & Schema Design
    -   [Document Analysis in Solr](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../indexing-guide/document-analysis.html)
    -   Indexing & Data Operations
-   Query Guide
    -   [Query Syntax and Parsers](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../query-guide/query-syntax-and-parsers.html)
    -   Enhancing Queries
    -   Controlling Results
    -   [Streaming Expressions](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/../query-guide/streaming-expressions.html)
-   -   [Solr Upgrade Notes](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/solr-upgrade-notes.html)
        -   [Major Changes in Solr 9](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/major-changes-in-solr-9.html)
        -   [Major Changes in Solr 8](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/major-changes-in-solr-8.html)
        -   [Major Changes in Solr 7](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/major-changes-in-solr-7.html)
        -   [Major Changes in Solr 6](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html/major-changes-in-solr-6.html)