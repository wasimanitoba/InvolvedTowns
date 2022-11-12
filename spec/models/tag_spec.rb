# frozen_string_literal: true

# == Schema Information
#
# Table name: tags
#
#  id         :bigint           not null, primary key
#  title      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_tags_on_title_and_user_id  (title,user_id) UNIQUE
#  index_tags_on_user_id            (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Tag, type: :model do
  let(:user)            { User.create!(email: 'fake2@fake.com', password: 'example', name: 'test user') }
  let(:parent)          { Tag.create! title: 'parent', user: user }
  let(:child)           { Tag.create! title: 'child', user: user }
  let(:friend)          { Tag.create! title: 'something vaguely related', user: user }
  let(:grandchild)      { Tag.create! title: 'grandchild', user: user }
  let(:grandchild)      { Tag.create! title: 'grandchild', user: user }

  let(:child_predicate) { 'descendance' }
  let(:other_predicate) { 'uncategorized association' }

  before do
    LinkedTag.create! subject: child, object: parent, predicate: child_predicate
    LinkedTag.create! subject: friend, object: parent, predicate: 'uncategorized association'
  end

  # bug: pluck/map were giving me different results from `select()` because i had messed up the active record associations
  # in either case, the tag should never have a redundant reference to itself.
  # these tests demonstrate that the destination is not the origin.
  describe '#subject_links has no weird self-reflection when using #map' do
    subject { child.subject_links.map(&:object_id) }

    it { is_expected.not_to eql(child.subject_links.map(&:subject_id)) }
  end

  describe '#subject_links has no weird self-reflection when using #select' do
    subject { child.subject_links.select(:object_id) }

    it { is_expected.not_to eql(child.subject_links.select(:subject_id)) }
  end

  describe '#object_links has no weird self-reflection when using #map' do
    subject { parent.object_links.map(&:subject_id) }

    it { is_expected.not_to eql(parent.object_links.map(&:object_id)) }
  end

  describe '#object_links has no weird self-reflection when using #select' do
    subject { parent.object_links.select(:subject_id) }

    it { is_expected.not_to eql(parent.object_links.select(:object_id)) }
  end

  describe '#objects' do
    subject { child.objects }

    it { is_expected.to contain_exactly(parent) }
    it { expect(parent.objects).to be_empty }
  end

  describe '#subjects' do
    subject(:subjects) { parent.subjects }

    it { is_expected.to contain_exactly(child, friend) }
    it { expect(child.subjects).to be_empty }
  end

  describe '#subjects_with_predicate' do
    subject { parent.subjects_with_predicate }

    before { LinkedTag.create! subject: grandchild, object: parent, predicate: child_predicate }

    let(:expected_subjects) do
      [
        { subject: child, relationship: child_predicate },
        { subject: grandchild, relationship: child_predicate },
        { subject: friend, relationship: other_predicate }
      ]
    end

    it { is_expected.to contain_exactly(*expected_subjects) }

    context 'when passing a predicate name' do
      subject { parent.subjects_with_predicate(other_predicate) }

      let(:expected_subjects) { [{ subject: friend, relationship: other_predicate }] }

      it { is_expected.to contain_exactly(*expected_subjects) }
    end
  end
end
