class User < ActiveRecord::Base

	def generateToken
		@time = Time.new
		@tmp = self.name + '~' + @time.to_i.to_s + ':'
		self.token = Digest::SHA2.hexdigest( @tmp )
	end
	
end
