class AddLtreeExtension < ActiveRecord::Migration[6.0]
    def change
      enable_extension 'ltree'
    end
end
