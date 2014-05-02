class SessionsController < ApplicationController
	include Firewall

	def requestSession
		# Received username and password
		if params[:username] and params[:password]
			password = params[:password]
			# Check if password is correct
			if password == Settings.global.password
				# Find the user with the token or create new user
				user = (User.find_by name: params[:username]) || User.new( :name => params[:username] )
				# Generate token
				token = user.generateToken
				# Persist user
				user.save
				# Return user data
				render json: { token: token, name: user.name, id: user.id }
				return
			end
		end
		# Send 401 
		render json: { error: 'Unauthorized', status: '401' }, :status => '401'
	end

	def checkToken
		# Check if has token as is valid
		if is :private 
			return
		end
		# Render nothing
		render :nothing => true
	end

	def options
		# Already handled at the app controller
		head :ok
	end

end