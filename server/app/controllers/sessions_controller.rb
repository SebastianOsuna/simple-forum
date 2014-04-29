class SessionsController < ApplicationController
	include Firewall

	def requestSession
		if params[:username] and params[:password]
			password = params[:password]
			if password == Settings.global.password
				user = (User.find_by name: params[:username]) || User.new( :name => params[:username] )
				token = user.generateToken
				user.save
				render json: { token: token, name: user.name, id: user.id }
				return
			end
		end
		# Send 401 
		render json: { error: 'Unauthorized', status: '401' }, :status => '401'
	end

	def checkToken
		if is :private 
			return
		end
		render :nothing => true
	end

	def options
		head :ok
	end

end