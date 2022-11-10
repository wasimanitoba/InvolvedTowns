# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # before_action :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  def new
    @browser = params[:app] == 'browser'

    super
  end

  # POST /resource/sign_in
  def create
    super

    if params[:browser].inquiry.true?
      redirect_to('https://d1bbb80ee87d02092a68044ad837c834a4809154.extensions.allizom.org/', allow_other_host: true)
    elsif params[:browser].inquiry.false? || params[:browser].blank?
      # redundant, but i like to remind myself that i'm *always* setting a string here and maybe it can just be `nil` or a boolean
      redirect_to root_url, notice: 'Logged in!'
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
