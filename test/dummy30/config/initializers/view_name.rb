module ActionView::Rendering 
  alias_method :_render_template_original, :_render_template
  def _render_template(template, layout = nil, options = {}) 
    @last_template = template
    _render_template_original(template, layout, options)
  end
end