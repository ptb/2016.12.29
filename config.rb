MIN = config[:environment] == :production
EXT = 'xhtml'.freeze

activate :blog do |blog|
  Time.zone = 'America/New_York'

  blog.sources = "a/{title}/index.#{EXT}"
  blog.default_extension = '.slim'

  # blog.layout = 'blog'
  blog.permalink = '{title}'

  # blog.generate_tag_pages = true
  blog.tag_template = "articles.#{EXT}"
  blog.taglink = "{tag}/index.#{EXT}"

  blog.calendar_template = "articles.#{EXT}"
  blog.year_link = "{year}/index.#{EXT}"
  blog.month_link = "{year}/{month}/index.#{EXT}"
  blog.day_link = "{year}/{month}/{day}/index.#{EXT}"

  blog.generate_year_pages = false
  blog.generate_month_pages = false
  blog.generate_day_pages = false

  blog.paginate = true
  blog.per_page = 3
  blog.page_link = 'page/{num}'
end

activate :directory_indexes

configure :development do
  if build?
    # url_for('/blog/file.xhtml') or url_for(sitemap.resources[0])
    # Example: link(href="#{url_for('/c/style.css')}" rel='stylesheet')

    activate :relative_assets
    set :relative_links, true
    set :strip_index_file, false
  end
end

configure :production do
  activate :asset_hash
  activate :minify_html, remove_quotes: false, simple_boolean_attributes: false
end

ignore(/.*\.keep/)
ignore(/\.es6/)
ignore(/\.sass/)
ignore(%r{,tag/.*})

set :build_dir, 'docs'
set :css_dir, 'c' if File.directory? 'code/c/'
set :fonts_dir, 'f' if File.directory? 'code/f/'
set :helpers_dir, 'help' if File.directory? 'help/'
set :images_dir, 'i' if File.directory? 'code/i/'
set :js_dir, 'j' if File.directory? 'code/j/'
set :layouts_dir, '_' if File.directory? 'code/_/'
set :source, 'code' if File.directory? 'code/'

set :https, true
set :ssl_certificate, 'localhost.crt'
set :ssl_private_key, 'localhost.key'

set :index_file, "index.#{EXT}"
set :layout, 'layout'

set :slim,
  attr_quote: "'",
  format: EXT.to_sym,
  pretty: !MIN,
  sort_attrs: true,
  shortcut: {
    '@' => { attr: 'role' },
    '#' => { attr: 'id' },
    '.' => { attr: 'class' },
    '%' => { attr: 'itemprop' },
    '^' => { attr: 'data-is' },
    '&' => { attr: 'type', tag: 'input' }
  }
