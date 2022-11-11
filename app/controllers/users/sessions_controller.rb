# frozen_string_literal: true

module Users
  class SessionsController < Devise::SessionsController
    # before_action :configure_sign_in_params, only: [:create]

    # GET /resource/sign_in
    def new
      @browser = params[:app] == 'browser'

      super
    end

    # POST /resource/sign_in
    def create
      if params[:browser]
        redirect_to('https://0417c160d5a4b5b90b292ad98482c9856d1d2018.extensions.allizom.org/', allow_other_host: true)
      elsif params[:browser].blank? || [false, ''].include?(params[:browser])
        super
      end
    end

    # DELETE /resource/sign_out
    # def destroy
    #   super
    # end

    # protected

    # If you have extra params to permit, append them to the sanitizer.
    # def configure_sign_in_params
    #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
    # end
  end
end
