require 'spec_helper'

describe "Direction" do
  
  let(:geocoding) { File.read "spec/fixtures/google_direction_valid.json" }
  
  context "valid request" do
    before(:each) do
      stub_request(:get, "http://maps.googleapis.com/maps/api/directions/json?destination=stubbed&language=en&origin=stubbed&sensor=false").
               to_return(:status => 200, :body => geocoding, :headers => {})
    end
    
    it "should render info from only start_end args" do
      result = Gmaps4rails.destination( {:from => "stubbed", :to => "stubbed"})
      result.should eq([
        {
          "duration"  =>  { "text" => "20 hours 40 mins", "value" => 74384.0 },
          "distance"  =>  { "text" => "1,328 mi", "value" => 2137146.0 },
          "steps"     =>  [
                            { "travel_mode"       =>  "DRIVING",
                              "start_location"    =>  { "lat" => 41.85073, "lng" => -87.65126 },
                              "end_location"      =>  { "lat" => 41.85258, "lng" => -87.65141 },
                              "duration"          =>  { "value" => 19, "text" => "1 min" },
                              "html_instructions" =>  "Head <b>north</b> on <b>S Morgan St</b> toward <b>W Cermak Rd</b>",
                              "distance"          =>  { "value" => 207, "text" => "0.1 mi" }
                            }
                          ],
          "polylines" =>"[{\"coded_array\":\"a~l~Fjk~uOwHJy@P\"}]"
        }
      ])
    end
    
    it "should clean output" do
      result = Gmaps4rails.destination( {:from => "stubbed", :to => "stubbed"}, {}, "clean")
      result.should eq([
        {
          "duration"  =>  { "text" => "20 hours 40 mins", "value" => 74384.0 },
          "distance"  =>  { "text" => "1,328 mi", "value" => 2137146.0 },
          "steps"     =>  [
                            { "travel_mode"       =>  "DRIVING",
                              "start_location"    =>  { "lat" => 41.85073, "lng" => -87.65126 },
                              "end_location"      =>  { "lat" => 41.85258, "lng" => -87.65141 },
                              "duration"          =>  { "value" => 19, "text" => "1 min" },
                              "html_instructions" =>  "Head <b>north</b> on <b>S Morgan St</b> toward <b>W Cermak Rd</b>",
                              "distance"          =>  { "value" => 207, "text" => "0.1 mi" }
                            }
                          ]
        }
      ])
    end
  end

end
