module ApplicationHelper
  
  def gmaps4rails_map(builder, options = {})
    render :partial => 'gmaps4rails/gmaps4rails', :locals => { :builder => builder, :options => options }
  end
  
end