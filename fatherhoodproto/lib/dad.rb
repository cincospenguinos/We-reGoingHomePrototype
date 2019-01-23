HOURS_IN_DAY = 8

class Dad
	attr_reader :hours_left, :success

	def initialize
		@days_passed = 0
		@hours_left = HOURS_IN_DAY
		@success = 0
		@rand = Random.new
	end

	def status
		if @success >= 100
			'You finished your work! Congrats!'
		elsif @success >= 95
			'You are almost done with your work! Just a bit more!'
		elsif @success >= 80
			'You have made good progress on your work.'
		elsif @success >= 70
			'You have made decent progress on your work'
		elsif @success >= 45
			'You are about half-way through your work'
		elsif @success >= 30
			'You have made some progress on your work.'
		elsif @success >= 20
			'You are underway on your work.'
		elsif @success >= 5
			'You have started your work.'
		else
			'You have not made any progress on your work.'
		end	
	end

	def time_passed(hours)
		@hours_left -= hours
	end

	def day_passed
		@days_passed += 1
		@hours_left = HOURS_IN_DAY
	end

	def has_hours(cost)
		return @hours_left >= cost
	end

	def work(hours)
		@hours_left -= hours
		@success += ((1 + Random.rand(hours)) / 2)
	end

	def successful?
		@success >= 100
	end
end