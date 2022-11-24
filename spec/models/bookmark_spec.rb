# == Schema Information
#
# Table name: bookmarks
#
#  id         :bigint           not null, primary key
#  title      :string
#  url        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_bookmarks_on_url_and_user_id  (url,user_id) UNIQUE
#  index_bookmarks_on_user_id          (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Bookmark, type: :model do
  subject(:bookmark) { Bookmark.new(user: fake_user, url: fake_url) }

  let(:fake_user) { User.create!(email: 'fake2@fake.com', password: 'example', name: 'test user') }
  let(:fake_url)  { 'www.example.com' }

  context 'when URL has spaces' do
    let(:fake_url) { 'not a valid URL string' }

    it { is_expected.not_to be_valid }
  end

  context 'when URL has no top-level domain' do
    let(:fake_url) { 'SomeWebsite' }

    it { is_expected.not_to be_valid }
  end

  context 'when creating a duplicate' do
    before { Bookmark.create! user: fake_user, url: fake_url }

    it { expect { bookmark.save }.to raise_error(ActiveRecord::RecordNotUnique) }
  end

  context 'when creating a duplicate with whitespace' do
    before { Bookmark.create user: fake_user, url: "     #{fake_url}" }

    it { expect { bookmark.save }.to raise_error(ActiveRecord::RecordNotUnique) }
  end

  context 'when creating a duplicate with whitespace' do
    before { Bookmark.create user: fake_user, url: "http://#{fake_url}" }

    it { expect { bookmark.save }.to raise_error(ActiveRecord::RecordNotUnique) }
  end

  describe '#url' do
    subject { bookmark.url }

    before { bookmark.save! }

    it { is_expected.to eq('example.com') }
  end

  describe '#save_with_constraints' do
    context 'when creating a duplicate' do
      before do
        Bookmark.create! user: fake_user, url: fake_url
        bookmark.save_with_constraints
      end

      it { is_expected.not_to be_valid }
    end

    context 'when creating a duplicate with whitespace' do
      before do
        Bookmark.create user: fake_user, url: "     #{fake_url}"
        bookmark.save_with_constraints
      end

      it { is_expected.not_to be_valid }
    end

    context 'when creating a duplicate with whitespace' do
      before do
        Bookmark.create user: fake_user, url: "http://#{fake_url}"
        bookmark.save_with_constraints
      end

      it { is_expected.not_to be_valid }
    end
  end
end
