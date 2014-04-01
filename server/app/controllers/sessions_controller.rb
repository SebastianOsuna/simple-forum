class SessionsController < ApplicationController
	def requestSession
		if params[:username] and params[:password]
			@password = params[:password]
			if @password == Settings.global.password
				render json: { username: params[:username], password: @password }
				return
			end
		end
		# Send 401 
		render json: { error: 'Unauthorized', status: '401' }, :status => '401'
	end

end
