class UsersController < ApplicationController    
  
  respond_to :html, :json, :gmaps4rails
  
  def index
    @users = User.all
    @json = User.all.to_gmaps4rails do |user, marker|
      marker.infowindow render_to_string(:partial => "/users/my_template", :locals => { :object => user}).gsub(/\n/, '').gsub(/"/, '\"')
      marker.marker_picture({:width => 20, :height => 25, :picture => "/images/marker.png"})
      marker.json "\"test\": #{user.id}"
    end
  end

  def show
    @user = User.find(params[:id])
  end

  def new
    @user = User.new
  end
  
  def renderer
    @users = User.all
    respond_with @users
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      redirect_to @user, :notice => "Successfully created user."
    else
      render :action => 'new'
    end
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    if @user.update_attributes(params[:user])
      redirect_to @user, :notice  => "Successfully updated user."
    else
      render :action => 'edit'
    end
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy
    redirect_to users_url, :notice => "Successfully destroyed user."
  end
  
  def test_list
    @json  = User.all.to_gmaps4rails
  end
  
  
  def test_partial
    @json  = User.all.to_gmaps4rails
  end
  
  def ajax_map
  end
  
  def comment
    
  end
  
end
