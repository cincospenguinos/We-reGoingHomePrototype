class Home

	attr_reader :child, :dad

	def initialize
		@child = Child.new('Hank')
		@dad = Dad.new
	end

	## Returns the status of the home and all its members
	def status
		@dad.status + "\n" + @child.status
	end

	def is_won?
		@dad.successful? && !@child.dead?
	end

	def is_lost?
		@child.dead?
	end

	## Returns the end score for the player, according to how well they did. Really it's just a bunch of stats.
	def score
	end

	## The verbs
	def cook(args)
		if !@child.can_eat?
			"#{@child.name} isn't hungry."
		else
			if args.length >= 1
				hours = nil
				replenish = nil

				case args[0]
				when :snack
					hours = 1
					replenish = 1
				when :meal
					hours = 2
					replenish = 3
				when :feast
					hours = 3
					replenish = 5
				end

				if @dad.has_hours(hours)
					@dad.time_passed(hours)
					@child.time_passed(hours)

					@child.feed(replenish)
					"You fed #{@child.name} a #{args[0].to_s}."
				else
					"You don't have time to make that."
				end
			else
				'You need to provide what kind of food (snack, meal, feast) you want to cook for your son.'
			end
		end
	end

	def water(args)
		if !@dad.has_hours(0.5)
			"You don't have enough time to get water for your son."
		elsif !@child.thirsty?
			"#{@child.name} isn't thirsty."
		else
			@child.time_passed(1)
			@dad.time_passed(1)
			@child.water(3)

			"You gave #{@child.name} some water."
		end
	end

	def sleep(args)
		@dad.day_passed
		@child.day_passed
		"A night passes.\n" + status
	end

	def work(args)
		if args.length > 0
			to_spend = args[0].to_s.to_i

			if to_spend < 4
				"It isn't worth working less than four hours a day."
			elsif @dad.has_hours(to_spend)
				@dad.work(to_spend)
				@child.time_passed(to_spend)
			else
				"You don't have enough time to spend working."
			end
		else
			'You need to give an amount of time you want to work'
		end
	end

	# def clean(args)
	# end

	# def instruct
	# end
end