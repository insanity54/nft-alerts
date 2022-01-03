# Src notes

## Redis Schema

```
SADD tokenSet [<tokenId>, <tokenId>, <...>]
HMSET token:<tokenId>:metadata store <store> metaId <metaId> inserted <inserted> preview <preview>
ZADD token:<tokenId>:sales <timestamp>, <txHash>
SET blockCounter <number> # the latest UBQ block that nft-alerts has processed
```


## sample token data from TG

```
{
  nft-alerts     nftId: '2467374318977626554008303018937286637655627110080170352631183468570607616',
  nft-alerts     store: '0x136dbBa0250687aB15E8cb6c01AC300d6663FD76',
  nft-alerts     metaId: '2',
  nft-alerts     inserted: '2021-12-11T06:17:04.357Z',
  nft-alerts     metadata: {
  nft-alerts       name: 'Silence of life - Quiet me...',
  nft-alerts       image: 'ipfs://QmfPLH3ZWWx87T2g6KJfLDerxp5AgD5tvHgTwp2uK1LJAj',
  nft-alerts       preview: 'ipfs://QmZ127Jz9hWgsSYr6hTGL12SX9bfPEyLj7HrKs2HSNeV9f',
  nft-alerts       properties: [Object],
  nft-alerts       description: 'They try to silence me... \n' +
  nft-alerts         'They try to make me their slave..\n' +
  nft-alerts         'A heavy burden. \n' +
  nft-alerts         '\n' +
  nft-alerts         'Money moves the world... and my silence moves my passion. \n' +
  nft-alerts         '\n' +
  nft-alerts         '\n' +
  nft-alerts         'Art.'
  nft-alerts     },

```