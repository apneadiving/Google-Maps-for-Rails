class RestrictedContentController < ApplicationController
  before_filter :authenticate_user!
end