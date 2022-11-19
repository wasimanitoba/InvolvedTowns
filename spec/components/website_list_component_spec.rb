# frozen_string_literal: true

require 'rails_helper'

RSpec.describe WebsiteListComponent, type: :component do
  subject { Capybara.string(component).find('input#websites', visible: :all)['data-submission-target'] }

  let(:component) { render_inline(described_class.new(submit_button: false)) }

  it { is_expected.to eq('websiteList') }

  context 'with the hidden input' do
    let(:component) { render_inline(described_class.new(submit_button: true)) }

    it { is_expected.to eq('websiteList') }
  end
end
