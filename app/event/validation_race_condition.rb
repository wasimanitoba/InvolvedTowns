# https://bignerdranch.com/blog/dont-get-tangled-in-your-database-constraints/
class ValidationRaceCondition
  # returns true if this is something we should rescue
  def self.===(exception)
    return true if exception.is_a?(ActiveRecord::RecordNotUnique)

    return true if exception.cause.is_a?(PG::ExclusionViolation)

    false
  end
end
