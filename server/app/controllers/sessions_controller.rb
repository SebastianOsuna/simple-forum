class SessionsController < ApplicationController

	def requestSession
		if params[:username] and params[:password]
			render json: { username: params[:username], password: params[:password] }
		else
			render json: { error: 'Unauthorized', status: '401' }, :status => '401'
		end
	end

end
