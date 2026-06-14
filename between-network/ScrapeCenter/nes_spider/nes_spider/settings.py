BOT_NAME = 'nes_spider'

SPIDER_MODULES = ['nes_spider.spiders']
NEWSPIDER_MODULE = 'nes_spider.spiders'

ROBOTSTXT_OBEY = True

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

DOWNLOAD_DELAY = 2

ITEM_PIPELINES = {
    'nes_spider.pipelines.NesSpiderPipeline': 300,
}

FEED_EXPORT_ENCODING = 'utf-8'
