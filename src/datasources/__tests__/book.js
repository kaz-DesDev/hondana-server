const BookAPI = require('../book');

const mocks = {
    get: jest.fn(),
};
const mockStore = {
  books: {
    findOrCreate: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn(),
  },
};
module.exports.mockStore = mockStore;

const ds = new BookAPI({ store: mockStore });
ds.get = mocks.get;

describe('[BookAPI.APIReducer]', () => {
    it('properly transforms book', () => {
        expect(ds.bookReducer(mockBookResponse)).toEqual(mockBook);
    });
});

describe('[BookAPI.getBookByIsbn]', () => {
    it('should look up single book from api', async() => {
        // if api response is list of raw books,
        // res should be single transformed book
        mocks.get.mockReturnValueOnce([mockBookResponse]);
        const res = await ds.getBookByIsbn({ isbn: 9784344036239 });

        expect(res).toEqual(mockBook);
        expect(mocks.get).toBeCalledWith('get', { isbn: 9784344036239 });
    });
});

describe('[bookAPI.getBooksByIsbns]', () => {
    it('should call getBookByIsbn for each isbn', async () => {
      // temporarily overwrite getBookById to test
      const getBookByIsbn = ds.getBookByIsbn;
      ds.getBookByIsbn = jest.fn(() => ({ isbn: 9784344036239 }));

      const res = await ds.getBooksByIsbns({ isbns: [9784344036239, 9784488028022] });

      expect(res).toEqual([{ isbn: 9784344036239 }, { isbn: 9784344036239 }]);
      expect(ds.getBookByIsbn).toHaveBeenCalledTimes(2);

      // set getBookByIsbn back to default
      ds.getBookByIsbn = getBookByIsbn;
    });
});

describe('[BookAPI.addBook]', () => {
  it('calls store creator and returns result', async () => {
    mockStore.books.findOrCreate.mockReturnValueOnce([{ get: () => 'heya' }]);

    // check the result of the fn
    const res = await ds.addBook({ isbn: 9784344036239 });
    expect(res).toBeTruthy();

    // make sure store is called properly
    expect(mockStore.books.findOrCreate).toBeCalledWith({
      where: { isbn: 9784344036239 },
    });
  });
});

describe('[BookAPI.getAllBooks]', () => {
  it('looks up books by user', async () => {
    const books = [
      { dataValues: { isbn: 9784344036239 } },
      { dataValues: { isbn: 9784788514348 } },
    ];
    mockStore.books.findAll.mockReturnValueOnce(books);

    // check the result of the fn
    const res = await ds.getAllBooks();
    expect(res).toEqual([9784344036239, 9784788514348]);

    // make sure store is called properly
    expect(mockStore.books.findAll).toBeCalledWith();
  });

  it('returns empty array if nothing found', async () => {
    // store lookup is not mocked to return anything, so this
    // simulates a failed lookup

    // check the result of the fn
    const res = await ds.getAllBooks();
    expect(res).toEqual([]);
  });
});


/**
 * MOCK DATA BELOW
 */

 // properly transformed book
const mockBook = {
    isbn: 9784344036239,
    title: "明け方の若者たち",
    volume: "",
    series: "",
    publisher: "幻冬舎",
    pubdate: "20200611",
    cover: "https://cover.openbd.jp/9784344036239.jpg",
    author: "カツセマサヒコ／著"
}

// raw launch book from API
const mockBookResponse = {
    onix: {
      RecordReference: 9784344036239,
      NotificationType: "02",
      ProductIdentifier: {
        ProductIDType: "15",
        IDValue: 9784344036239
      },
      DescriptiveDetail: {
        ProductComposition: "00",
        ProductForm: "BA",
        ProductFormDetail: "B119",
        Collection: {
          CollectionType: "10",
          CollectionSequence: {
            CollectionSequenceType: "01",
            CollectionSequenceTypeName: "完結フラグ",
            CollectionSequenceNumber: "0"
          }
        },
        TitleDetail: {
          TitleType: "01",
          TitleElement: {
            TitleElementLevel: "01",
            TitleText: {
              collationkey: "アケガタノワカモノタチ",
              content: "明け方の若者たち"
            }
          }
        },
        Contributor: [
          {
            SequenceNumber: "1",
            ContributorRole: [
              "A01"
            ],
            PersonName: {
              collationkey: "カツセ マサヒコ",
              content: "カツセ マサヒコ"
            },
            BiographicalNote: "1986年東京生まれ、大学を卒業後、2009年より一般企業にて勤務。趣味で書いていたブログをきっかけに編集プロダクションに転職し、2017年4月に独立。ウェブライター、編集として活動中。本書がデビュー作となる。"
          }
        ],
        Language: [
          {
            LanguageRole: "01",
            LanguageCode: "jpn"
          }
        ],
        Extent: [
          {
            ExtentType: "11",
            ExtentValue: "240",
            ExtentUnit: "03"
          }
        ],
        Subject: [
          {
            SubjectSchemeIdentifier: "78",
            SubjectCode: "0093"
          },
          {
            SubjectSchemeIdentifier: "79",
            SubjectCode: "01"
          }
        ],
        Audience: [
          {
            AudienceCodeType: "22",
            AudienceCodeValue: "00"
          }
        ]
      },
      CollateralDetail: {
        TextContent: [
          {
            TextType: "03",
            ContentAudience: "00",
            Text: "安達祐実、村山由佳、尾崎世界観、紗倉まな、今泉力哉、長谷川朗、推薦!\n近くて遠い2010年代を青々しく描いた、人気ウェブライターのデビュー小説。\n\n「私と飲んだ方が、楽しいかもよ笑？」\nその16文字から始まった、沼のような5年間。\n\n明大前で開かれた退屈な飲み会。そこで出会った彼女に、一瞬で恋をした。本多劇場で観た舞台。「写ルンです」で撮った江の島。IKEAで買ったセミダブルベッド。フジロックに対抗するために旅をした7月の終わり。\n世界が彼女で満たされる一方で、社会人になった僕は、\"こんなハズじゃなかった人生\"に打ちのめされていく。息の詰まる満員電車。夢見た未来とは異なる現在。深夜の高円寺の公園と親友だけが、救いだったあの頃。\n\nそれでも、振り返れば全てが、美しい。\n人生のマジックアワーを描いた、20代の青春譚。\n\nドキドキする。好きな人を想うときみたいに。　\n――安達祐実（俳優）　\n痛くて愛おしいのは、これがあなたの物語だからだ。カツセの魔法は長編でも健在。\n――村山由佳（作家）　\nどうしても下北沢に馴染めなくて、逃げるように乗った井の頭線。通り過ぎた明大前のしみったれたお前。お前にあの頃出会いたかった。　\n――尾崎世界観（クリープハイプ）　\nひたむきに生きるとは、こういうことなのだと思う。　\n――紗倉まな（AV女優）　\n人にフラれて絶望するという経験をせずに死んでいくのか、俺は。と絶望したし嫉妬した。　\n――今泉力哉（映画監督）　\n「こんなはずじゃなかった」未来を生きている大人は共感しかない。甘い恋愛小説と思って読んで後悔した。\n――長谷川朗（ヴィレッジヴァンガード下北沢 次長）"
          }
        ],
        SupportingResource: [
          {
            ResourceContentType: "01",
            ContentAudience: "01",
            ResourceMode: "03",
            ResourceVersion: [
              {
                ResourceForm: "02",
                ResourceVersionFeature: [
                  {
                    ResourceVersionFeatureType: "01",
                    FeatureValue: "D502"
                  },
                  {
                    ResourceVersionFeatureType: "04",
                    FeatureValue: "9784344036239.jpg"
                  }
                ],
                ResourceLink: "https://cover.openbd.jp/9784344036239.jpg"
              }
            ]
          }
        ]
      },
      PublishingDetail: {
        Imprint: {
          ImprintIdentifier: [
            {
              ImprintIDType: "19",
              IDValue: "87728"
            },
            {
              ImprintIDType: "19",
              IDValue: "344"
            },
            {
              ImprintIDType: "24",
              IDValue: "2076"
            }
          ],
          ImprintName: "幻冬舎"
        },
        Publisher: {
          PublishingRole: "01",
          PublisherIdentifier: [
            {
              PublisherIDType: "19",
              IDValue: "87728"
            },
            {
              PublisherIDType: "19",
              IDValue: "344"
            },
            {
              PublisherIDType: "24",
              IDValue: "2076"
            }
          ],
          PublisherName: "幻冬舎"
        },
        PublishingDate: [
          {
            PublishingDateRole: "01",
            Date: "20200611"
          }
        ]
      },
      ProductSupply: {
        MarketPublishingDetail: {
          MarketPublishingStatus: "00"
        },
        SupplyDetail: {
          ProductAvailability: "99",
          Price: [
            {
              PriceType: "03",
              PriceAmount: "1400",
              CurrencyCode: "JPY"
            }
          ]
        }
      }
    },
    hanmoto: {
      datemodified: "2020-06-03 16:27:49",
      datecreated: "2020-05-18 16:25:48",
      datekoukai: "2020-05-18"
    },
    summary: {
      isbn: 9784344036239,
      title: "明け方の若者たち",
      volume: "",
      series: "",
      publisher: "幻冬舎",
      pubdate: "20200611",
      cover: "https://cover.openbd.jp/9784344036239.jpg",
      author: "カツセマサヒコ／著"
    }
};

module.exports.mockBookResponse = mockBookResponse;
